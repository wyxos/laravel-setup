import chalk from 'chalk'
import inquirer from 'inquirer'
import { execSync } from 'child_process'

export const success = (message) => console.log(chalk.green(message) + '\n')

export const warn = (message) => console.log(chalk.yellow(message) + '\n')

export const ask = async (question, defaultAnswer) => {
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

export const confirm = async (question, defaultAnswer = true) => {
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

export const execSyncOut = (command) => {
  execSync(command, { stdio: 'inherit' })
}
