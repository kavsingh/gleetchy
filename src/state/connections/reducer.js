import { CONNECTIONS_ACTION } from './actions'

const defaultState = { key: 'value' }

const doSomething = (state /* , payload */) => ({ ...state })

const connectionsReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case CONNECTIONS_ACTION:
      return doSomething(state, payload)
    default:
      return state
  }
}

export default connectionsReducer
