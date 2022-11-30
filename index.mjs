#!/usr/bin/env node
import { program } from 'commander'
import scaffold from './src/scaffold.mjs'
import fs from 'fs'
import path, { dirname } from 'path'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { success, warn } from './src/helpers.js'

const execSyncOut = (command) => {
  execSync(command, { stdio: 'inherit' })
}

config()

program
  .argument('<homestead>', 'Homestead yaml path', 'C:/homestead/Homestead.yaml')
  .option('--windows', 'flag to alter host file and yaml on Windows')

program.parse()

const options = program.opts()

const args = program.args

if (options.windows) {
  const __dirname = dirname(fileURLToPath(import.meta.url))

  const fileContains = (path, pattern) => {
    const yaml = fs.readFileSync(path, 'utf8')

    return yaml.includes(pattern)
  }

  const appendAfter = (path, pattern, insert) => {
    const yaml = fs.readFileSync(path, 'utf8')

    const lines = yaml.split('\n')

    const targetLine = lines.findIndex(row => row.includes(pattern))

    lines.splice(targetLine + 1,0,  ...insert)

    fs.writeFileSync(path, lines.join('\n'))
  }

  let projectPath = process.cwd()

  const replaceString = (location, pattern, replacement) => {
    let data = fs.readFileSync(path.resolve(projectPath, location)).toString()

    data = data.replace(pattern, replacement)

    fs.writeFileSync(path.resolve(projectPath, location), data)
  }

  let yamlPath = path.resolve(args[0])

  let domain = process.env.APP_DOMAIN

  let database = process.env.DB_DATABASE

  let site = `    - map: ${domain}`

  if(!fileContains(yamlPath, site)){
    const mapTo = projectPath.replace(/\\/g, '/')
      .replace(/(.*)\/code\/(.*)/, '$2')

    appendAfter(yamlPath, 'sites:', [
      site,
      `      to: /home/vagrant/code/${mapTo}/public`
    ])

    success('mapping to site added to yaml.')
  }

  if(!fileContains(yamlPath, database)){
    appendAfter(yamlPath, 'databases:', [
      site,
      `    - task_tracker`
    ])

    success('added database to yaml.')
  }

  // alter windows host
  const hostPath = path.resolve('C:/Windows/System32/drivers/etc/hosts')

  if(!fileContains(hostPath, domain)){
    fs.appendFileSync(hostPath, `\n192.168.10.10 ${domain}`)
  }

  success('hosts updated.')
  // trigger homestead reload provision
  warn('reloading homestead...')

  execSyncOut('homestead provision')

  warn('installing dependencies...')

  execSyncOut('npm update --save')

  warn('starting dev server...')

  execSyncOut('npm run dev')

  success('ready!')
} else {
  scaffold()
}

