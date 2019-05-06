import produce from 'immer'
import { Reducer } from 'redux'

import { nodeColorPool } from '~/style/color'
import {
  nodeProps as delayNodeProps,
  nodeType as delayNodeType,
} from '~/nodes/audioEffects/delay'
import {
  nodeProps as reverbNodeProps,
  nodeType as reverbNodeType,
} from '~/nodes/audioEffects/reverb'
import { AudioEffectNode, audioEffects } from '~/state/defaultNodes'
import {
  constructDefaultState,
  NodesReducerState,
  removeNodeFromState,
  updateNodeLabelInState,
  updateNodePropsInState,
} from '~/state/nodeReducerUtil'
import { prefixedId } from '~/util/id'

import { AudioEffectsAction } from './types'

export type AudioEffectsState = NodesReducerState<AudioEffectNode>

const defaultState = constructDefaultState<AudioEffectNode>(audioEffects)

const addAudioEffect = (
  state: AudioEffectsState,
  { type }: { type: string },
) => {
  switch (type) {
    case delayNodeType: {
      const newDelay = {
        color:
          nodeColorPool[state.orderedIdentifiers.length % nodeColorPool.length],
        id: prefixedId('delay'),
        label: 'DX',
        props: { ...delayNodeProps },
        type: delayNodeType,
      }

      return produce<AudioEffectsState>(state, draftState => {
        draftState.byId[newDelay.id] = newDelay
        draftState.orderedIdentifiers.push({
          id: newDelay.id,
          type: newDelay.type,
        })
      })
    }
    case reverbNodeType: {
      const newReverb = {
        color:
          nodeColorPool[state.orderedIdentifiers.length % nodeColorPool.length],
        id: prefixedId('reverb'),
        label: `RX`,
        props: { ...reverbNodeProps },
        type: reverbNodeType,
      }

      return produce<AudioEffectsState>(state, draftState => {
        draftState.byId[newReverb.id] = newReverb
        draftState.orderedIdentifiers.push({
          id: newReverb.id,
          type: newReverb.type,
        })
      })
    }
    default:
      return state
  }
}

const audioEffectsReducer: Reducer<AudioEffectsState, AudioEffectsAction> = (
  state = defaultState,
  action,
) => {
  switch (action.type) {
    case 'AUDIO_EFFECT_ADD':
      return addAudioEffect(state, action.payload)
    case 'AUDIO_EFFECT_REMOVE':
      return removeNodeFromState<AudioEffectNode, AudioEffectsState>(
        state,
        action.payload,
      )
    case 'AUDIO_EFFECT_UPDATE_PROPS':
      return updateNodePropsInState<AudioEffectNode, AudioEffectsState>(
        state,
        action.payload,
      )
    case 'AUDIO_EFFECT_UPDATE_LABEL':
      return updateNodeLabelInState<AudioEffectNode, AudioEffectsState>(
        state,
        action.payload,
      )
    default:
      return state
  }
}

export default audioEffectsReducer
