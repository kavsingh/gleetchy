import { AUDIO_CONTEXT_UPDATE_LABEL } from './actionTypes'

export const updateAudioContextLabelAction = (id, label) => ({
  type: AUDIO_CONTEXT_UPDATE_LABEL,
  payload: { id, label },
})
