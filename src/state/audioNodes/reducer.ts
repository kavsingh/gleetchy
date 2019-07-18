import produce from 'immer'
import { Reducer } from 'redux'
import { without } from 'ramda'

import {
  defaultProps as delayDefaultProps,
  nodeType as delayNodeType,
  NodeProps as DelayNodeProps,
} from '~/nodes/audioEffects/delay'
import {
  defaultProps as reverbDefaultProps,
  nodeType as reverbNodeType,
  NodeProps as ReverbNodeProps,
} from '~/nodes/audioEffects/reverb'
import {
  defaultProps as loopDefaultProps,
  nodeType as loopNodeType,
  NodeProps as LoopNodeProps,
} from '~/nodes/instruments/loop'
import initialNodes from '~/state/defaultNodes'
import { prefixedId } from '~/util/id'
import { pickObjectKeys } from '~/util/object'
import { AudioNodeState } from '~/types'

import { AudioFileDecodeCompleteAction } from '../audioFiles/types'
import { AudioNodesAction } from './types'

type NodeState = AudioNodeState<
  LoopNodeProps | DelayNodeProps | ReverbNodeProps | {}
>

export interface AudioNodesState {
  byId: { [key: string]: NodeState }
  orderedIds: string[]
}

const defaultState: AudioNodesState = initialNodes.reduce(
  (acc: AudioNodesState, instrument) => {
    acc.byId[instrument.id] = instrument
    acc.orderedIds.push(instrument.id)
    return acc
  },
  { byId: {}, orderedIds: [] },
)

const getNewNodeState = (type: string): AudioNodeState | null => {
  switch (type) {
    case delayNodeType:
      return {
        type,
        id: prefixedId(delayNodeType),
        label: 'DX',
        audioProps: { ...delayDefaultProps },
      }
    case reverbNodeType: {
      return {
        type,
        id: prefixedId(reverbNodeType),
        label: `RX`,
        audioProps: { ...reverbDefaultProps },
      }
    }
    case loopNodeType: {
      return {
        type,
        id: prefixedId(loopNodeType),
        label: 'LX',
        audioProps: { ...loopDefaultProps },
      }
    }
    default:
      return null
  }
}

const addNode = (state: AudioNodesState, { type }: { type: string }) => {
  const newNodeState = getNewNodeState(type)

  if (!newNodeState) return state

  return produce<AudioNodesState>(state, draftState => {
    draftState.byId[newNodeState.id] = newNodeState
    draftState.orderedIds.push(newNodeState.id)
  })
}

const audioNodesReducer: Reducer<
  AudioNodesState,
  AudioNodesAction | AudioFileDecodeCompleteAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'AUDIO_NODE_ADD':
      return addNode(state, action.payload)
    case 'AUDIO_NODE_REMOVE':
      return produce(state, draftState => {
        const { id } = action.payload

        if (draftState.byId[id]) delete draftState.byId[id]

        if (draftState.orderedIds.includes(id)) {
          draftState.orderedIds = without([id], draftState.orderedIds)
        }
      })
    case 'AUDIO_NODE_UPDATE_AUDIO_PROPS':
      return produce(state, draftState => {
        const existing = draftState.byId[action.payload.id]

        if (existing) {
          Object.assign(existing.audioProps, action.payload.audioProps)
        }
      })
    case 'AUDIO_NODE_UPDATE_LABEL':
      return produce(state, draftState => {
        const existing = draftState.byId[action.payload.id]

        if (existing) existing.label = action.payload.label
      })
    case 'AUDIO_FILE_DECODE_COMPLETE':
      return produce(state, draftState => {
        const { id, file } = action.payload
        const existing = draftState.byId[id]

        if (existing) {
          Object.assign(
            existing.audioProps,
            pickObjectKeys(existing.audioProps)(file),
          )
        }
      })
    default:
      return state
  }
}

export default audioNodesReducer
