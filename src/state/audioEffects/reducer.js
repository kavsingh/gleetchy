import { propEq } from 'ramda'
import COLORS from '~/constants/color'
import {
  removeNodeFromState,
  updateNodePropsInState,
  updateNodeLabelInState,
} from '~/state/nodeReducerUtil'
import { audioEffects } from '~/state/defaultNodes'
import {
  nodeType as delayNodeType,
  nodeProps as delayNodeProps,
} from '~/nodes/audioEffects/delay'
import {
  nodeType as reverbNodeType,
  nodeProps as reverbNodeProps,
} from '~/nodes/audioEffects/reverb'
import {
  AUDIO_EFFECT_ADD,
  AUDIO_EFFECT_REMOVE,
  AUDIO_EFFECT_UPDATE_PROPS,
  AUDIO_EFFECT_UPDATE_LABEL,
} from './actionTypes'

const defaultState = [...audioEffects]

const addAudioEffect = (state, { type }) => {
  switch (type) {
    case delayNodeType: {
      const delayNodes = state.filter(propEq('type', delayNodeType))

      return [
        ...state,
        {
          type: delayNodeType,
          id: `delay${delayNodes.length}`,
          label: `D${delayNodes.length}`,
          color: COLORS[state.length % COLORS.length],
          props: { delayNodeProps },
        },
      ]
    }
    case reverbNodeType: {
      const reverbNodes = state.filter(propEq('type', reverbNodeType))

      return [
        ...state,
        {
          type: reverbNodeType,
          id: `reverb${reverbNodes.length}`,
          label: `R${reverbNodes.length}`,
          color: COLORS[state.length % COLORS.length],
          props: { ...reverbNodeProps },
        },
      ]
    }
    default:
      return state
  }
}

const audioEffectsReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case AUDIO_EFFECT_ADD:
      return addAudioEffect(state, payload)
    case AUDIO_EFFECT_REMOVE:
      return removeNodeFromState(state, payload)
    case AUDIO_EFFECT_UPDATE_PROPS:
      return updateNodePropsInState(state, payload)
    case AUDIO_EFFECT_UPDATE_LABEL:
      return updateNodeLabelInState(state, payload)
    default:
      return state
  }
}

export default audioEffectsReducer