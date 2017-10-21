const { jsContent } = require('../util')

module.exports = name =>
  jsContent(`
    import { createSelector } from 'reselect'

    const ${name}Selector = state => state.${name}

    export const keySelector = createSelector(
      ${name}Selector,
      ${name} => ${name}.key,
    )
  `)
