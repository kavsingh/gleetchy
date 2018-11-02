import { AudioContextUpdateLabelAction } from './types'

export const updateAudioContextLabelAction = (
  id: string,
  label: string,
): AudioContextUpdateLabelAction => ({
  payload: { id, label },
  type: 'AUDIO_CONTEXT_UPDATE_LABEL',
})
