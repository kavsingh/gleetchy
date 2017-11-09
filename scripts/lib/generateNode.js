const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const { NODE_TYPES, NODES_ROOT } = require('./constants')
const spawnAsync = require('./spawnAsync')
const uiTemplate = require('./templates/component')
const nodeIndexTemplate = require('./templates/nodeIndex')
const nodeTypeTemplate = require('./templates/nodeType')
const nodePropsTemplate = require('./templates/nodeProps')
const createAudioNodeTemplate = require('./templates/createAudioNode')

const generateNode = async (type, name) => {
  if (!NODE_TYPES.includes(type)) {
    throw new Error(`Unknown node type ${type}`)
  }

  const nodePath = path.resolve.bind(path, NODES_ROOT, `${type}s`, name)

  try {
    await spawnAsync('mkdir', ['-p', nodePath()])
    await Promise.all(
      [
        ['index', () => nodeIndexTemplate()],
        ['UI', () => uiTemplate(name)],
        ['nodeType', () => nodeTypeTemplate(type, name)],
        ['nodeProps', () => nodePropsTemplate()],
        ['createAudioNode', () => createAudioNodeTemplate()],
      ].map(([fileName, render]) =>
        writeFile(nodePath(`${fileName}.js`), render()),
      ),
    )

    return { nodeName: name, nodePath: nodePath() }
  } catch (error) {
    throw error
  }
}

module.exports = generateNode
