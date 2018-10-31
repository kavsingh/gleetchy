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
import { uuid } from '~/util/uuid'

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
          id: uuid(),
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
          id: uuid(),
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
      return removeNodeFromState(state, action.payload)
    case 'AUDIO_EFFECT_UPDATE_PROPS':
      return updateNodePropsInState(state, action.payload)
    case 'AUDIO_EFFECT_UPDATE_LABEL':
      return updateNodeLabelInState(state, action.payload)
    default:
      return state
  }
}

export default audioEffectsReducer