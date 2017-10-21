const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const { STATE_ROOT } = require('./constants')
const spawnAsync = require('./spawnAsync')
const reducerTemplate = require('./templates/reducer')
const actionTypesTemplate = require('./templates/actionTypes')
const actionsTemplate = require('./templates/actions')
const selectorsTemplate = require('./templates/selectors')

const generateState = async name => {
  const statePath = path.resolve.bind(path, STATE_ROOT, name)

  try {
    await spawnAsync('mkdir', ['-p', statePath()])
    await Promise.all(
      [
        ['reducer', reducerTemplate],
        ['actionTypes', actionTypesTemplate],
        ['actions', actionsTemplate],
        ['selectors', selectorsTemplate],
      ].map(([fileName, template]) =>
        writeFile(statePath(`${fileName}.js`), template(name)),
      ),
    )

    return { stateName: name, statePath: statePath() }
  } catch (error) {
    throw error
  }
}

module.exports = generateState
