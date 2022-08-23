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
  .option('--windows', 'flag to alter host file and yaml on Windows')

program.parse()

const options = program.opts()

if (options.windows) {
  const __dirname = dirname(fileURLToPath(import.meta.url))

  let projectPath = process.cwd()

  const replaceString = (location, pattern, replacement) => {
    let data = fs.readFileSync(path.resolve(projectPath, location)).toString()

    data = data.replace(pattern, replacement)

    fs.writeFileSync(path.resolve(projectPath, location), data)
  }

  let yamlPath = path.resolve('C:/homestead/Homestead.yaml')

  const yaml = fs.readFileSync(yamlPath).toString()

  let domain = process.env.APP_DOMAIN

  let replacement = fs.readFileSync(path.resolve(__dirname, 'stubs/yaml-sites.txt')).toString()

  let site = `- map: ${domain}`

  const mapTo = projectPath.replace(/\\/g, '/')
    .replace(/(.*)\/code\/(.*)/, '$2')

  site += '\n    '

  site += `  to: /home/vagrant/code/${mapTo}/public`

  if (new RegExp(/### Laravel Setup Sites: START ###/).test(yaml)) {
    let replacement = site

    replacement += '\n    '

    replacement += '### Laravel Setup Sites: END ###'

    replaceString(yamlPath, /### Laravel Setup Sites: END ###/, replacement)
  } else {
    replacement = replacement.replace(/\$\{SITES}/, site)

    replaceString(yamlPath, /sites:/, replacement)
  }
  success('yaml updated.')
  // alter windows host
  const hostPath = path.resolve('C:/Windows/System32/drivers/etc/hosts')

  fs.appendFileSync(hostPath, `\n192.168.10.10 ${domain}`)

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

