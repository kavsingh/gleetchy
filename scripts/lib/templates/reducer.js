const { jsContent, toConstantName } = require('../util')

module.exports = name =>
  jsContent(`
    import { ${toConstantName(name)}_ACTION } from './actionTypes'

    const defaultState = { key: 'value' }

    const doSomething = (state /* , payload */) => ({ ...state })

    const ${name}Reducer = (
      state = defaultState,
      { type, payload = {} } = {},
    ) => {
      switch (type) {
        case ${toConstantName(name)}_ACTION:
          return doSomething(state, payload)
        default:
          return state
      }
    }

    export default ${name}Reducer
  `)
