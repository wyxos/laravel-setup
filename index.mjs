#!/usr/bin/env node
import { program } from 'commander'
import scaffold from './src/scaffold.mjs'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config()

program
  .option('--windows', 'flag to alter host file and yaml on Windows')

program.parse()

const options = program.opts()

if (options.windows) {
  let projectPath = process.cwd()

  const replaceString = (location, pattern, replacement) => {
    let data = fs.readFileSync(path.resolve(projectPath, location)).toString()

    data = data.replace(pattern, replacement)

    fs.writeFileSync(path.resolve(projectPath, location), data)
  }
  // if flag host and value windows
  // alter yaml
  let yamlPath = path.resolve('C:/homestead/Homestead.yaml')

  const yaml = fs.readFileSync(yamlPath).toString()

  if (new RegExp(/### Laravel Setup: Sites ###/).test(yaml)) {

  } else {
    let replacement = 'sites:'

    replacement += '\n'

    replacement += '    ### Laravel Setup Sites: START ###'

    replacement += '\n'

    let domain = process.env.APP_DOMAIN

    replacement += `    - map: ${domain}`

    const mapTo = projectPath.replace(/\\/g, '/')
      .replace(/(.*)\/code\/(.*)/, '$2')

    replacement += '\n'

    replacement += `      to: /home/vagrant/code/${mapTo}`

    replacement += '\n'

    replacement += '    ### Laravel Setup Sites: END ###'

    replaceString(yamlPath, /sites:/, replacement)
  }
  // alter windows host
  // trigger homestead reload provision
} else {
  scaffold()
}

