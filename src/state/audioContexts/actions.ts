import { AUDIO_CONTEXT_UPDATE_LABEL } from './actionTypes'

export const updateAudioContextLabelAction = (id: string, label: string) => ({
  payload: { id, label },
  type: AUDIO_CONTEXT_UPDATE_LABEL,
})
