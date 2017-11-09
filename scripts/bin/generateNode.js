const chalk = require('chalk')
const path = require('path')
const generateNode = require('../lib/generateNode')

const [nodeType, nodeName] = process.argv.slice(2)

console.log(chalk.white.bold('Generating node...'))

generateNode(nodeType, nodeName)
  .then(({ nodeName: name, nodePath }) => {
    console.log(
      chalk.green.bold(
        `Generated ${name} at ${path.relative(process.cwd(), nodePath)}\n`,
      ),
    )
  })
  .catch(error => console.log(chalk.red(`${error}\n`)))
