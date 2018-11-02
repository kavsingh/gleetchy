import { ActionWithPayload } from '~/types'

export type AudioContextUpdateLabelAction = ActionWithPayload<
  'AUDIO_CONTEXT_UPDATE_LABEL',
  { id: string; label: string }
>

export type AudioContextsAction = AudioContextUpdateLabelAction
