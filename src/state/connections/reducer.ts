import { Reducer } from 'redux'
import { produce } from 'immer'
import { allPass, propEq } from 'ramda'

import { nodeColorPool } from '~/style/color'
import { AudioNodeConnection } from '~/types'
import { stableWithout } from '~/lib/util'

import defaultNodes from '../default-nodes'
import { AudioNodeRemoveAction } from '../audio-nodes/types'
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

export const connectionsReducer: Reducer<
  ConnectionsState,
  ConnectionsAction | AudioNodeRemoveAction
> = (state = defaultState, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'CONNECTION_ADD': {
        const { fromId, toId } = action.payload

        if (!draftState.find(connectionIs({ fromId, toId }))) {
          draftState.push({
            from: fromId,
            to: toId,
            color: nodeColorPool[draftState.length % nodeColorPool.length],
          })
        }

        break
      }
      case 'CONNECTION_REMOVE': {
        const { fromId, toId } = action.payload
        const idx = draftState.findIndex(connectionIs({ fromId, toId }))

        if (idx !== -1) draftState.splice(idx, 1)

        break
      }
      case 'AUDIO_NODE_REMOVE': {
        const { id } = action.payload

        draftState = stableWithout(
          draftState.filter(({ from, to }) => from === id || to === id),
          draftState,
        )

        break
      }
      default:
        break
    }
  })
