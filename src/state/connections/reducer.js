import { allPass, propEq, without } from 'ramda'
import COLORS from '../../constants/color'
import { instruments, audioContexts } from '../defaultNodes'
import { INSTRUMENT_REMOVE } from '../instruments/actionTypes'
import { FX_REMOVE } from '../fx/actionTypes'
import { CONNECTION_ADD, CONNECTION_REMOVE } from './actionTypes'

const defaultState = [
  { from: instruments[0].id, to: audioContexts[0].id, color: COLORS[0] },
  { from: instruments[1].id, to: audioContexts[0].id, color: COLORS[1] },
]

const connectionIs = ({ fromId, toId }) =>
  allPass([propEq('from', fromId), propEq('to', toId)])

const addConnection = (state, { fromId, toId }) => {
  const existing = state.find(connectionIs({ fromId, toId }))

  if (existing) return state

  return [
    ...state,
    { from: fromId, to: toId, color: COLORS[state.length % COLORS.length] },
  ]
}

const removeConnection = (state, { fromId, toId }) => {
  const existing = state.find(connectionIs({ fromId, toId }))

  return existing ? without([existing], state) : state
}

const removeAllConnectionsForId = (state, { id }) => {
  const toRemove = state.filter(({ from, to }) => from === id || to === id)

  if (!toRemove.length) return state

  return without(toRemove, state)
}

const connectionsReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case CONNECTION_ADD:
      return addConnection(state, payload)
    case CONNECTION_REMOVE:
      return removeConnection(state, payload)
    case INSTRUMENT_REMOVE:
    case FX_REMOVE:
      return removeAllConnectionsForId(state, payload)
    default:
      return state
  }
}

export default connectionsReducer
