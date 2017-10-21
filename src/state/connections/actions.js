import { CONNECTIONS_ACTION } from './actions'

export const doConnectionsAction = val => ({
  type: CONNECTIONS_ACTION,
  payload: { val },
})
