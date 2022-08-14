import inquirer from 'inquirer'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { success, warn } from './helpers.js'

export default async function setup(){
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
    warn('adding node dependencies...')

    deps.forEach(dep => {
      if(typeof dep === 'object'){
        packageJson[key][Object.keys(dep)[0]] = dep[Object.keys(dep)[0]]
      }else{
        packageJson[key][dep] = 'latest'
      }
    })

    success('package.json updated')

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

  const confirm = async (question, defaultAnswer = true) => {
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
    return execSync(`git --work-tree="${projectPath}" --git-dir="${projectPath}/.git" ${command}`, { stdio: [] })
  }

  const npm = (command) => {
    return execSync(`npm -C ${projectPath} ${command}`, { stdio: [] })
  }

  const stageFiles = () => {
    git('add .', {stdio : 'pipe' })
  }

  const commit = (message) => {
    warn(`commit with message "${message}"...`)

    stageFiles()

    git(`commit -m="${message}"`)
  }

  const copy = (source, destination) => {
    destination = destination || source

    if (destination === '/') {
      destination = ''
    }

    source = path.resolve(__dirname, '..', `stubs/${source}`)

    destination = `${projectPath}/${destination}`

    fse.copySync(source, destination, { overwrite: true })

    success(`copied \n--- ${source} \n--- -> ${destination}`)
  }

  const appendFile = (location, data) => {
    fs.appendFileSync(path.resolve(projectPath, location), data)
  }

  const replaceString = (location, pattern, replacement) => {
    let data = fs.readFileSync(path.resolve(projectPath, location)).toString()

    data = data.replace(pattern, replacement)

    fs.writeFileSync(path.resolve(projectPath, location), data)
  }

  function installLaravel () {
    warn('installing Laravel...')

    execSync(`laravel new ${projectName}`, { stdio: [] })
  }

  const processPath = process.cwd()

  const projectName = await ask('Name of the project?', 'my-app')

  const projectPath = path.resolve(processPath, projectName)

  const pathExists = fs.existsSync(projectPath)

  const removePath = pathExists ? await confirm('The project already exists. Do you wish to delete?') : false

  const initialCommit = await confirm('Perform initial commit?')

  const npmInstall = await confirm('Run "npm install"?', false)

  if (removePath) {
    execSync(`rm -R ${projectName}`, { stdio: [] })
  }

  installLaravel()

  warn('Initializing git...')

  git('init')

  if (initialCommit) {
    commit('feat: initial commit')
  }

  addDevDependencies('laravel-vite-plugin vite-plugin-mkcert @vitejs/plugin-vue'.split(' '))

  copy('vite.config.js')

  commit('feat: configured vite')

  addDevDependencies('vue @oruga-ui/oruga-next @oruga-ui/theme-bulma sass sass-loader'.split(' '))

  commit('feat: configured ui')

  copy('resources')

  addDevDependencies([
    {'@wyxos/vue-3-helpers': 'github:wyxos/vue-3-helpers'},
  ])

  commit('feat: resources structure')

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

  commit('feat: secure session + test route')

  replaceString('.env', /APP_URL=.*/, `APP_DOMAIN=${projectName}.test\nAPP_URL=https://\${APP_DOMAIN}`)

  success('scaffold complete. If you are on Windows, run npx wyxos/laravel-setup --windows to update your yaml and hosts.')

// SETUP DEV ENVIRONMENT
}
