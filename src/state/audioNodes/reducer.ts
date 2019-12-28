import { Reducer } from 'redux'
import { produce } from 'immer'
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
import { stableOmit } from '~/util/object'
import { stableFilter } from '~/util/array'
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

const audioNodesReducer: Reducer<
  AudioNodesState,
  AudioNodesAction | AudioFileDecodeCompleteAction
> = (state = defaultState, action) =>
  produce(state, draftState => {
    switch (action.type) {
      case 'AUDIO_NODE_ADD': {
        const newNodeState = getNewNodeState(action.payload.type)

        if (newNodeState) {
          draftState.byId[newNodeState.id] = newNodeState
          draftState.orderedMeta.push({
            id: newNodeState.id,
            type: newNodeState.type,
          })
        }

        break
      }
      case 'AUDIO_NODE_DUPLICATE': {
        const exisiting = draftState.byId[action.payload.id]

        if (!exisiting) break

        const duplicate = {
          ...exisiting,
          id: prefixedId(exisiting.type),
          label: `${exisiting.label} Copy`,
        }

        draftState.byId[duplicate.id] = duplicate

        const existingMetaIndex = draftState.orderedMeta.findIndex(
          ({ id }) => id === exisiting.id,
        )

        if (existingMetaIndex === -1) {
          draftState.orderedMeta.push({
            id: duplicate.id,
            type: duplicate.type,
          })
        } else {
          draftState.orderedMeta.splice(existingMetaIndex + 1, 0, duplicate)
        }

        break
      }
      case 'AUDIO_NODE_REMOVE': {
        const { id } = action.payload

        draftState.byId = stableOmit([id], draftState.byId)
        draftState.orderedMeta = stableFilter(
          meta => meta.id !== id,
          draftState.orderedMeta,
        )

        break
      }
      case 'AUDIO_NODE_UPDATE_AUDIO_PROPS': {
        const { id, audioProps } = action.payload
        const existing = draftState.byId[id]

        if (existing) Object.assign(existing.audioProps, audioProps)

        break
      }
      case 'AUDIO_NODE_UPDATE_LABEL': {
        const { id, label } = action.payload
        const existing = draftState.byId[id]

        if (existing) existing.label = label

        break
      }
      case 'AUDIO_FILE_DECODE_COMPLETE': {
        const { id, file } = action.payload
        const existing = draftState.byId[id]

        if (existing) {
          Object.assign(
            existing.audioProps,
            pick(Object.keys(existing.audioProps), file),
          )
        }

        break
      }
      default:
        break
    }
  })

export default audioNodesReducer
