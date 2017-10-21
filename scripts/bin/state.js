const chalk = require('chalk')
const path = require('path')
const generateState = require('../lib/generateState')

const [stateName] = process.argv.slice(2)

console.log(chalk.white.bold('Generating state...'))

generateState(stateName)
  .then(({ stateName: name, statePath }) => {
    console.log(
      chalk.green.bold(
        `Generated ${name} at ${path.relative(process.cwd(), statePath)}\n`,
      ),
    )
  })
  .catch(error => console.log(chalk.red(`${error}\n`)))
