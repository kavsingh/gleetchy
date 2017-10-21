const { jsContent, upperFirst } = require('../util')

module.exports = name =>
  jsContent(`
    import { ${name.toUpperCase()}_ACTION } from './actions'

    export const do${upperFirst(name)}Action = val => ({
      type: ${name.toUpperCase()}_ACTION,
      payload: { val },
    })
  `)
