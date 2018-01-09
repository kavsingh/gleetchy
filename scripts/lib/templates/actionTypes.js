const { jsContent, toConstantName } = require('../util')

module.exports = name =>
  jsContent(`
    export const ${toConstantName(name)}_ACTION = '${toConstantName(
    name,
  )}_ACTION'
  `)
