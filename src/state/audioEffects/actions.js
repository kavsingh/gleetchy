import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'

import {
  AUDIO_EFFECT_ADD,
  AUDIO_EFFECT_REMOVE,
  AUDIO_EFFECT_UPDATE_PROPS,
  AUDIO_EFFECT_UPDATE_LABEL,
} from './actionTypes'

export const addAudioEffectAction = type => ({
  type: AUDIO_EFFECT_ADD,
  payload: { type },
})

export const addDelayAction = () => addAudioEffectAction(delayType)

export const addReverbAction = () => addAudioEffectAction(reverbType)

export const removeAudioEffectAction = id => ({
  type: AUDIO_EFFECT_REMOVE,
  payload: { id },
})

export const updateAudioEffectPropsAction = (id, props) => ({
  type: AUDIO_EFFECT_UPDATE_PROPS,
  payload: { id, props },
})

export const updateAudioEffectLabelAction = (id, label) => ({
  type: AUDIO_EFFECT_UPDATE_LABEL,
  payload: { id, label },
})
