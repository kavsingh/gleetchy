import { allPass, propEq, without } from 'ramda'
import { Reducer } from 'redux'

import { nodeColorPool } from '~/style/color'
import { AudioEffectRemoveAction } from '~/state/audioEffects/types'
import { audioContexts, instruments } from '~/state/defaultNodes'
import { InstrumentRemoveAction } from '~/state/instruments/types'
import { AudioNodeConnection } from '~/types'

import { ConnectionDescriptor, ConnectionsAction } from './types'

export type ConnectionsState = AudioNodeConnection[]

const defaultState: ConnectionsState = [
  { from: instruments[0].id, to: audioContexts[0].id, color: nodeColorPool[0] },
  { from: instruments[1].id, to: audioContexts[0].id, color: nodeColorPool[1] },
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
  ConnectionsAction | InstrumentRemoveAction | AudioEffectRemoveAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'CONNECTION_ADD':
      return addConnection(state, action.payload)
    case 'CONNECTION_REMOVE':
      return removeConnection(state, action.payload)
    case 'INSTRUMENT_REMOVE':
    case 'AUDIO_EFFECT_REMOVE':
      return removeAllConnectionsForId(state, action.payload)
    default:
      return state
  }
}

export default connectionsReducer
