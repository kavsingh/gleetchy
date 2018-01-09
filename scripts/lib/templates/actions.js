const { jsContent, upperFirst, toConstantName } = require('../util')

module.exports = name =>
  jsContent(`
    import { ${toConstantName(name)}_ACTION } from './actionTypes'

    export const do${upperFirst(name)}Action = val => ({
      type: ${toConstantName(name)}_ACTION,
      payload: { val },
    })
  `)
