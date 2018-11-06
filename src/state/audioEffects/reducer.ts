import { Reducer } from 'redux'

import COLORS from '~/constants/color'
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
  removeNodeFromState,
  updateNodeLabelInState,
  updateNodePropsInState,
} from '~/state/nodeReducerUtil'
import { prefixedId } from '~/util/id'

import { AudioEffectsAction } from './types'

export type AudioEffectsState = AudioEffectNode[]

const defaultState: AudioEffectsState = [...audioEffects]

const addAudioEffect = (
  state: AudioEffectsState,
  { type }: { type: string },
) => {
  switch (type) {
    case delayNodeType: {
      return [
        ...state,
        {
          color: COLORS[state.length % COLORS.length],
          id: prefixedId('delay'),
          label: 'DX',
          props: { delayNodeProps },
          type: delayNodeType,
        },
      ]
    }
    case reverbNodeType: {
      return [
        ...state,
        {
          color: COLORS[state.length % COLORS.length],
          id: prefixedId('reverb'),
          label: `RX`,
          props: { ...reverbNodeProps },
          type: reverbNodeType,
        },
      ]
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
      return removeNodeFromState<AudioEffectsState>(state, action.payload)
    case 'AUDIO_EFFECT_UPDATE_PROPS':
      return updateNodePropsInState<AudioEffectsState>(state, action.payload)
    case 'AUDIO_EFFECT_UPDATE_LABEL':
      return updateNodeLabelInState<AudioEffectsState>(state, action.payload)
    default:
      return state
  }
}

export default audioEffectsReducer
