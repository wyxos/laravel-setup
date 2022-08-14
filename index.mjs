#!/usr/bin/env node

import inquirer from 'inquirer'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

const packageJson = {
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "axios": "latest",
    "laravel-vite-plugin": "latest",
    "lodash": "latest",
    "postcss": "latest",
    "vite": "latest",
    "vite-plugin-mkcert": "latest",
    "@vitejs/plugin-vue": "latest"
  },
  "dependencies": {
  }
}

const updateDependencies = (deps, key = 'dependencies') => {
  deps.forEach(dep => {
    if(typeof dep === 'object'){
      packageJson[key][Object.keys(dep)[0]] = dep[Object.keys(dep)[0]]
    }else{
      packageJson[key][dep] = 'latest'
    }
  })

  writePackageJson()
}

const addDevDependencies = (deps) => {
  updateDependencies(deps, 'devDependencies')
}

const addDependencies = (deps) => {
  updateDependencies(deps)
}

const writePackageJson = () => {
  fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify(packageJson, null, 2))
}

const ask = async (question, defaultAnswer) => {
  const { answer } = await inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      default: defaultAnswer,
      message: question
    }
  ])

  return answer
}

const confirm = async (question, defaultAnswer = 'y') => {
  const { answer } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'answer',
      default: defaultAnswer,
      message: question
    }
  ])

  return answer
}

const execSyncOut = (command) => {
  execSync(command, { stdio: 'inherit' })
}

const git = (command) => {
  return execSyncOut(`git --work-tree="${projectPath}" --git-dir="${projectPath}/.git" ${command}`)
}

const npm = (command) => {
  return execSyncOut(`npm -C ${projectPath} ${command}`)
}

const stageFiles = () => {
  git('add .')
}

const commit = (message) => {
  stageFiles()

  git(`commit -m="${message}"`)
}

const copy = (source, destination) => {
  destination = destination || source

  if (destination === '/') {
    destination = ''
  }

  return fse.copySync(path.resolve(__dirname, `stubs/${source}`), `${projectPath}/${destination}`, { overwrite: true })
}

const appendFile = (location, data) => {
  fs.appendFileSync(path.resolve(projectPath, location), data)
}

const processPath = process.cwd()

console.log(processPath)

// SETUP LARAVEL

// ask for app name
const projectName = await ask('Name of the project?', 'my-app')

// verify if folder exists
const projectPath = path.resolve(processPath, projectName)

const pathExists = fs.existsSync(projectPath)

const removePath = pathExists ? await confirm('The project already exists. Do you wish to delete?') : false

const initialCommit = await confirm('Perform initial commit?')

const npmInstall = await confirm('Run "npm install"?', 'n')

if (removePath) {
// if exists, request if to delete or skip setup

  // if delete, delete then proceed

  // run laravel new $appName
  execSyncOut(`rm -R ${projectName}`)

  execSyncOut(`laravel new ${projectName}`)

  // if skip, proceed
} else {
// if not exist, run laravel new $appName
  execSyncOut(`laravel new ${projectName}`)
}

// SETUP GIT

// run git init inside the project

git('init')

// update gitignore to include composer lock

// stage all files

if (initialCommit) {
// add commit message

  commit('feat: initial commit')
}

// ask for remote repository

// if provided, push to remote repository

// SETUP VITEJS + VUE + ORUGA + BULMA

// update package.json

// npm('install --save vite laravel-vite-plugin vite-plugin-mkcert @vitejs/plugin-vue')
addDevDependencies([
  'laravel-vite-plugin',
  'vite-plugin-mkcert',
  '@vitejs/plugin-vue'
])

// update vite.config.js

copy('vite.config.js')

commit('feat: configured vite')

// install oruga and bulma
// npm(`install --save vue @oruga-ui/oruga-next @oruga-ui/theme-bulma sass sass-loader`)
addDevDependencies([
  'vue',
  '@oruga-ui/oruga-next',
  '@oruga-ui/theme-bulma',
  'sass',
  'sass-loader',
])

commit('feat: configured ui')

copy('resources/scss')
copy('resources/js')
copy('resources/views')

// Install wyxos vue helpers

// npm(`install --save @wyxos/vue-3-helpers`)
addDevDependencies([
  {'@wyxos/vue-3-helpers': 'github:wyxos/vue-3-helpers'},
])

commit('feat: resources structure')

// install eslint
// npm(`install --save eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-json eslint-plugin-n eslint-plugin-node eslint-plugin-promise eslint-plugin-vue prettier @prettier/plugin-php`)
addDevDependencies('eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-json eslint-plugin-n eslint-plugin-node eslint-plugin-promise eslint-plugin-vue prettier @prettier/plugin-php'.split(' '))

copy('lint', '/')

commit('feat: configured lint')

// SETUP PROJECT PHP DEPENDENCIES

// Install laravel breeze

// Install horizon

// Install scout

// Install sanctum

// Install spatie role

// Install spatie tag

// Install wyxos laravel resources

// SETUP PROJECT NODE DEPENDENCIES

// Install oruga

// SETUP PHP lint

// SETUP Vite UI

// CLEANUP NODE IF WINDOWS

if (npmInstall) {
  npm('i')

  npm('update --save')

  commit('feat: installed node dependencies')
}

appendFile('.env', '\nSESSION_SECURE_COOKIE=true')

appendFile('routes/api.php', '\nRoute::get(\'/test\', function () {\n' +
  '    return \'Hello World!\';\n' +
  '});')

// SETUP DEV ENVIRONMENT

