import { produce } from 'immer'
import { pick } from 'ramda'
import type { Reducer } from 'redux'

import {
  defaultProps as delayDefaultProps,
  nodeType as delayNodeType,
} from '~/nodes/audio-effects/delay'
import {
  defaultProps as reverbDefaultProps,
  nodeType as reverbNodeType,
} from '~/nodes/audio-effects/reverb'
import {
  defaultProps as loopDefaultProps,
  nodeType as loopNodeType,
} from '~/nodes/instruments/loop'
import initialNodes from '~/state/default-nodes'
import { prefixedId } from '~/lib/id'
import { stableOmit, stableFilter } from '~/lib/util'
import type { NodeProps as DelayNodeProps } from '~/nodes/audio-effects/delay'
import type { NodeProps as ReverbNodeProps } from '~/nodes/audio-effects/reverb'
import type { NodeProps as LoopNodeProps } from '~/nodes/instruments/loop'
import type { AudioNodeState, AudioNodeIdentifierMeta } from '~/types'

import type { AudioFileDecodeCompleteAction } from '../audio-files/types'
import type { AudioNodesAction } from './types'

type KnownProps = DelayNodeProps | ReverbNodeProps | LoopNodeProps | {}

export interface AudioNodesState {
  byId: {
    [key: string]: AudioNodeState<KnownProps>
  }
  orderedIndentifierMeta: AudioNodeIdentifierMeta[]
}

const defaultState: AudioNodesState = initialNodes.reduce(
  (acc: AudioNodesState, instrument) => {
    acc.byId[instrument.id] = instrument
    acc.orderedIndentifierMeta.push({
      id: instrument.id,
      type: instrument.type,
    })
    return acc
  },
  { byId: {}, orderedIndentifierMeta: [] },
)

const getNewNodeState = (type: string) => {
  switch (type) {
    case delayNodeType:
      return {
        type,
        id: prefixedId(delayNodeType),
        label: 'DX',
        audioProps: { ...delayDefaultProps },
      } as AudioNodeState<DelayNodeProps>
    case reverbNodeType: {
      return {
        type,
        id: prefixedId(reverbNodeType),
        label: `RX`,
        audioProps: { ...reverbDefaultProps },
      } as AudioNodeState<ReverbNodeProps>
    }
    case loopNodeType: {
      return {
        type,
        id: prefixedId(loopNodeType),
        label: 'LX',
        audioProps: { ...loopDefaultProps },
      } as AudioNodeState<LoopNodeProps>
    }
    default:
      return null
  }
}

export const audioNodesReducer: Reducer<
  AudioNodesState,
  AudioNodesAction | AudioFileDecodeCompleteAction
> = (state = defaultState, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'AUDIO_NODE_ADD': {
        const newNodeState = getNewNodeState(action.payload.type)

        if (newNodeState) {
          draftState.byId[newNodeState.id] = newNodeState
          draftState.orderedIndentifierMeta.push({
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

        const existingMetaIndex = draftState.orderedIndentifierMeta.findIndex(
          ({ id }) => id === exisiting.id,
        )

        if (existingMetaIndex === -1) {
          draftState.orderedIndentifierMeta.push({
            id: duplicate.id,
            type: duplicate.type,
          })
        } else {
          draftState.orderedIndentifierMeta.splice(
            existingMetaIndex + 1,
            0,
            duplicate,
          )
        }

        break
      }
      case 'AUDIO_NODE_REMOVE': {
        const { id } = action.payload

        draftState.byId = stableOmit([id], draftState.byId)
        draftState.orderedIndentifierMeta = stableFilter(
          (meta) => meta.id !== id,
          draftState.orderedIndentifierMeta,
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
