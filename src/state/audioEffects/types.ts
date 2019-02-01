import { ActionWithPayload } from '~/types'

export type AudioEffectAddAction = ActionWithPayload<
  'AUDIO_EFFECT_ADD',
  { type: string }
>

export type AudioEffectRemoveAction = ActionWithPayload<
  'AUDIO_EFFECT_REMOVE',
  { id: string }
>

export type AudioEffectUpdateLabelAction = ActionWithPayload<
  'AUDIO_EFFECT_UPDATE_LABEL',
  { id: string; label: string }
>

export type AudioEffectUpdatePropsAction = ActionWithPayload<
  'AUDIO_EFFECT_UPDATE_PROPS',
  { id: string; props: object }
>

export type AudioEffectsAction =
  | AudioEffectAddAction
  | AudioEffectRemoveAction
  | AudioEffectUpdateLabelAction
  | AudioEffectUpdatePropsAction
