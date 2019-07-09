import produce from 'immer'
import { Reducer } from 'redux'

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
import { AudioNodeState, AudioNodeMeta } from '~/types'

import { AudioFileDecodeCompleteAction } from '../audioFiles/types'
import { AudioNodesAction } from './types'

type NodeState = AudioNodeState<
  LoopNodeProps | DelayNodeProps | ReverbNodeProps | {}
>

interface ById {
  [key: string]: NodeState
}

export interface AudioNodesState {
  byId: ById
  orderedMeta: AudioNodeMeta[]
}

const defaultState: AudioNodesState = {
  byId: initialNodes.reduce((acc: ById, instrument) => {
    acc[instrument.id] = instrument
    return acc
  }, {}),
  orderedMeta: initialNodes.map(({ id, type }) => ({ id, type })),
}

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
        const orderedIndex = draftState.orderedMeta.findIndex(
          node => id === node.id,
        )

        if (orderedIndex !== -1) {
          draftState.orderedMeta.splice(orderedIndex, 1)
        }

        if (draftState.byId[id]) {
          delete draftState.byId[id]
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
