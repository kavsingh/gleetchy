const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '../../')
const NODES_ROOT = path.resolve(PROJECT_ROOT, 'src/nodes')
const COMPONENTS_ROOT = path.resolve(PROJECT_ROOT, 'src/components')
const STATE_ROOT = path.resolve(PROJECT_ROOT, 'src/state')

const NODE_TYPES = ['instrument', 'audioEffect']

module.exports = {
  PROJECT_ROOT,
  NODES_ROOT,
  COMPONENTS_ROOT,
  STATE_ROOT,
  NODE_TYPES,
}
