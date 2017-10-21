const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '../../')
const COMPONENTS_ROOT = path.resolve(PROJECT_ROOT, 'src/components')
const STATE_ROOT = path.resolve(PROJECT_ROOT, 'src/state')

module.exports = { PROJECT_ROOT, COMPONENTS_ROOT, STATE_ROOT }
