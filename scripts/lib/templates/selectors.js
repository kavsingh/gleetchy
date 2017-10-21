const { jsContent } = require('../util')

module.exports = name =>
  jsContent(`
    import { identity } from 'ramda'
    import { createSelector } from 'reselect'

    const ${name}StateSelector = state => state.${name}

    export const ${name}Selector = createSelector(
      ${name}StateSelector,
      identity,
    )
  `)
