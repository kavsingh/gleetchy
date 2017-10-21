const { jsContent } = require('../util')

module.exports = name =>
  jsContent(`
    export const ${name.toUpperCase()}_ACTION = '${name.toUpperCase()}_ACTION'
  `)
