const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const { COMPONENTS_ROOT } = require('./constants')
const spawnAsync = require('./spawnAsync')
const componentTemplate = require('./componentTemplate')
const { upperFirst } = require('./util')

const generateComponent = async name => {
  const componentName = upperFirst(name)
  const componentPath = path.resolve(COMPONENTS_ROOT, componentName)
  const content = componentTemplate(componentName)

  try {
    await spawnAsync('mkdir', ['-p', componentPath])
    await writeFile(path.resolve(componentPath, 'index.js'), content)

    return { componentName, componentPath }
  } catch (error) {
    throw error
  }
}

module.exports = generateComponent
