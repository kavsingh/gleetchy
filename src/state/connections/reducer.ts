import { allPass, propEq, without } from 'ramda'
import { Reducer } from 'redux'

import { nodeColorPool } from '~/style/color'
import { AudioNodeConnection } from '~/types'

import defaultNodes from '../defaultNodes'
import { AudioNodeRemoveAction } from '../audioNodes/types'
import { ConnectionDescriptor, ConnectionsAction } from './types'

export type ConnectionsState = AudioNodeConnection[]

const mainOut = defaultNodes[0]
const loop1 = defaultNodes[1]
const loop2 = defaultNodes[2]

const defaultState: ConnectionsState = [
  { from: loop1.id, to: mainOut.id, color: nodeColorPool[0] },
  { from: loop2.id, to: mainOut.id, color: nodeColorPool[1] },
]

const connectionIs = ({ fromId, toId }: ConnectionDescriptor) =>
  allPass([propEq('from', fromId), propEq('to', toId)])

const addConnection = (
  state: ConnectionsState,
  { fromId, toId }: ConnectionDescriptor,
) => {
  const existing = state.find(connectionIs({ fromId, toId }))

  return existing
    ? state
    : [
        ...state,
        {
          from: fromId,
          to: toId,
          color: nodeColorPool[state.length % nodeColorPool.length],
        },
      ]
}

const removeConnection = (
  state: ConnectionsState,
  { fromId, toId }: ConnectionDescriptor,
) => {
  const existing = state.find(connectionIs({ fromId, toId }))

  return existing ? without([existing], state) : state
}

const removeAllConnectionsForId = (
  state: ConnectionsState,
  { id }: { id: string },
) => {
  const toRemove = state.filter(({ from, to }) => from === id || to === id)

  return toRemove.length ? without(toRemove, state) : state
}

const connectionsReducer: Reducer<
  ConnectionsState,
  ConnectionsAction | AudioNodeRemoveAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'CONNECTION_ADD':
      return addConnection(state, action.payload)
    case 'CONNECTION_REMOVE':
      return removeConnection(state, action.payload)
    case 'AUDIO_NODE_REMOVE':
      return removeAllConnectionsForId(state, action.payload)
    default:
      return state
  }
}

export default connectionsReducer
