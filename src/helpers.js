import chalk from 'chalk'

export const success = (message) => console.log(chalk.green(message))

export const warn = (message) => console.log(chalk.yellow(message))
