const { jsContent } = require('../util')

module.exports = name =>
  jsContent(`
    import { ${name.toUpperCase()}_ACTION } from './actions'

    const defaultState = { key: 'value' }

    const doSomething = (state /* , payload */) => ({ ...state })

    const ${name}Reducer = (
      state = defaultState,
      { type, payload = {} } = {},
    ) => {
      switch (type) {
        case ${name.toUpperCase()}_ACTION:
          return doSomething(state, payload)
        default:
          return state
      }
    }

    export default ${name}Reducer
  `)
