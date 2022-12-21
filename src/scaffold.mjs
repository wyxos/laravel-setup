import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { ask, execSyncOut, success, warn, confirm } from './helpers.js'
import { execSync } from 'child_process'

export default async function setup(){
  const __dirname = dirname(fileURLToPath(import.meta.url))

  const updateDependencies = (deps, key = 'dependencies') => {
    let packageJson = JSON.parse(fs.readFileSync(`${projectPath}/package.json`).toString())

    warn('adding node dependencies...')

    deps.forEach(dep => {
      if(typeof dep === 'object'){
        packageJson[key][Object.keys(dep)[0]] = dep[Object.keys(dep)[0]]
      }else{
        packageJson[key][dep] = 'latest'
      }
    })

    success('package.json updated')

    writePackageJson(packageJson)
  }

  const addDevDependencies = (deps) => {
    updateDependencies(deps, 'devDependencies')
  }

  const addDependencies = (deps) => {
    updateDependencies(deps)
  }

  const writePackageJson = (packageJson) => {
    fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify(packageJson, null, 2))
  }

  const git = (command) => {
    return execSyncOut(`git --work-tree="${projectPath}" --git-dir="${projectPath}/.git" ${command}`)
  }

  const npm = (command) => {
    return execSyncOut(`npm -C ${projectPath} ${command}`)
  }

  const composer = (command) => {
    return execSyncOut(`composer --working-dir ${projectPath} ${command}`)
  }

  const artisan = (command) => {
    return execSyncOut(`php ${projectPath}/artisan ${command}`)
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

    source = path.resolve(__dirname, `../stubs/${source}`)

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

    execSyncOut(`laravel new ${projectName}`)
  }

  function addScripts(scripts){
    let packageJson = JSON.parse(fs.readFileSync(`${projectPath}/package.json`).toString())

    warn('adding scripts...')

    scripts.forEach(script => {
      packageJson.scripts[Object.keys(script)[0]] = Object.values(script)[0]
    })

    success('package.json updated')

    writePackageJson(packageJson)
  }

  function addAppVersion(){
    let packageJson = JSON.parse(fs.readFileSync(`${projectPath}/package.json`).toString())

    packageJson.version = '1.0.0.alpha.1'

    success('package.json updated')

    writePackageJson(packageJson)
  }

  const processPath = process.cwd()

  const projectName = await ask('Name of the project?', 'my-app')

  const projectPath = path.resolve(processPath, projectName)

  const pathExists = fs.existsSync(projectPath)

  const removePath = pathExists ? await confirm('The project already exists. Do you wish to delete?') : false

  const initialCommit = await confirm('Perform initial commit?')

  const npmInstall = await confirm('Run "npm install"?', false)

  if (removePath) {
    execSyncOut(`rm -R ${projectName}`)
  }

  installLaravel()

  execSyncOut(`rm ${projectName}/composer.lock`)

  appendFile('.gitignore', '/package-lock.json\n')

  appendFile('.gitignore', '/composer.lock\n')

  warn('initializing git...')

  git('init')

  if (initialCommit) {
    commit('feat: initial commit')
  }

  composer('require laravel/breeze --dev')

  artisan('breeze:install')

  composer('require laravel/horizon')

  artisan('horizon:install')

  composer('require laravel/scout')

  artisan('vendor:publish --provider="Laravel\\Scout\\ScoutServiceProvider"')

  composer('require algolia/algoliasearch-client-php')

  composer('require spatie/laravel-permission')

  artisan('vendor:publish --provider="Spatie\\Permission\\PermissionServiceProvider"')

  composer('require spatie/laravel-tags')

  artisan('vendor:publish --provider="Spatie\\Tags\\TagsServiceProvider" --tag="tags-migrations"')

  composer('require barryvdh/laravel-debugbar --dev')

  composer('require wyxos/laravel-resources')

  commit('feat: installed php dependencies')

  addDevDependencies('laravel-vite-plugin vite-plugin-mkcert @vitejs/plugin-vue'.split(' '))

  copy('vite.config.js')

  commit('feat: vite configuration')

  addDevDependencies('vue vue-router @oruga-ui/oruga-next @tailwindcss/forms @tailwindcss/nesting @tailwindcss/typography vue-inline-svg @tailwindcss/nesting postcss-import'.split(' '))

  commit('feat: configured ui')

  copy('resources')

  copy('config')

  addDevDependencies([
    {'@wyxos/vue-3-helpers': 'github:wyxos/vue-3-helpers'},
  ])

  commit('feat: resources structure')

  addDevDependencies('eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-json eslint-plugin-n eslint-plugin-node eslint-plugin-promise eslint-plugin-vue prettier @prettier/plugin-php vite-plugin-eslint'.split(' '))

  copy('lint', '/')

  addScripts([
    {'lint:js' : 'eslint . --fix --ext .js,.vue,.json && prettier --write **/*{.js,.vue,.json}'},
    {'lint:php' : 'prettier --config .prettierrc.php.json **/*.php --write --ignore-unknown'},
    {'lint' : 'npm run lint:js && npm run lint:php'}
  ])

  commit('feat: configured lint')

// SETUP PHP lint

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

  copy('database')

  replaceString('.env', /APP_URL=.*/, `APP_DOMAIN=${projectName}.test\nAPP_URL=https://\${APP_DOMAIN}`)
  replaceString('.env', /DB_USERNAME=.*/, `DB_USERNAME=homestead`)
  replaceString('.env', /DB_PASSWORD=.*/, `DB_PASSWORD=secret`)

  const databaseName = projectName.replace(/-/g, '_')

  execSyncOut(`mysql -u homestead -e "create database ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" || echo "database already exists."`)

  artisan('migrate:fresh --seed')

  addDevDependencies(['chalk', 'inquirer'])

  copy('release.mjs')

  addScripts([
    {'release' : 'node release.mjs'},
  ])

  addAppVersion()

  commit('feat: release script')

  success('scaffold complete. If you are on Windows, run npx wyxos/laravel-setup --windows to update your yaml and hosts.')
}
