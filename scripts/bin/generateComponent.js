const chalk = require('chalk')
const path = require('path')
const generateComponent = require('../lib/generateComponent')

const [componentName] = process.argv.slice(2)

console.log(chalk.white.bold('Generating component...'))

generateComponent(componentName)
  .then(({ componentName: name, componentPath }) => {
    console.log(
      chalk.green.bold(
        `Generated ${name} at ${path.relative(process.cwd(), componentPath)}\n`,
      ),
    )
  })
  .catch(error => console.log(chalk.red(`${error}\n`)))
