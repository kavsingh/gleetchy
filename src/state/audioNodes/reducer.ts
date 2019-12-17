import produce from 'immer'
import { Reducer } from 'redux'
import { pick } from 'ramda'

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
import { AudioNodeState, ImmutableAudioNodeMeta } from '~/types'

import { AudioFileDecodeCompleteAction } from '../audioFiles/types'
import { AudioNodesAction } from './types'

type NodeState = AudioNodeState<
  LoopNodeProps | DelayNodeProps | ReverbNodeProps | {}
>

export interface AudioNodesState {
  byId: { [key: string]: NodeState }
  orderedMeta: ImmutableAudioNodeMeta[]
}

const defaultState: AudioNodesState = initialNodes.reduce(
  (acc: AudioNodesState, instrument) => {
    acc.byId[instrument.id] = instrument
    acc.orderedMeta.push({ id: instrument.id, type: instrument.type })
    return acc
  },
  { byId: {}, orderedMeta: [] },
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
    draftState.orderedMeta.push({
      id: newNodeState.id,
      type: newNodeState.type,
    })
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

        const orderedMetaIndex = draftState.orderedMeta.findIndex(
          meta => meta.id === id,
        )

        if (orderedMetaIndex > -1) {
          draftState.orderedMeta.splice(orderedMetaIndex, 1)
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
            pick(Object.keys(existing.audioProps), file),
          )
        }
      })
    default:
      return state
  }
}

export default audioNodesReducer
