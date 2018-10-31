import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'

import {
  AudioEffectAddAction,
  AudioEffectRemoveAction,
  AudioEffectUpdateLabelAction,
  AudioEffectUpdatePropsAction,
} from './types'

export const addAudioEffectAction = (type: string): AudioEffectAddAction => ({
  payload: { type },
  type: 'AUDIO_EFFECT_ADD',
})

export const addDelayAction = () => addAudioEffectAction(delayType)

export const addReverbAction = () => addAudioEffectAction(reverbType)

export const removeAudioEffectAction = (
  id: string,
): AudioEffectRemoveAction => ({
  payload: { id },
  type: 'AUDIO_EFFECT_REMOVE',
})

export const updateAudioEffectPropsAction = (
  id: string,
  props: any,
): AudioEffectUpdatePropsAction => ({
  payload: { id, props },
  type: 'AUDIO_EFFECT_UPDATE_PROPS',
})

export const updateAudioEffectLabelAction = (
  id: string,
  label: string,
): AudioEffectUpdateLabelAction => ({
  payload: { id, label },
  type: 'AUDIO_EFFECT_UPDATE_LABEL',
})
