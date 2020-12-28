import type { ActionWithPayload } from '~/types'

export type AudioNodeAddAction = ActionWithPayload<
  'AUDIO_NODE_ADD',
  { type: string }
>

export type AudioNodeDuplicateAction = ActionWithPayload<
  'AUDIO_NODE_DUPLICATE',
  { id: string }
>

export type AudioNodeRemoveAction = ActionWithPayload<
  'AUDIO_NODE_REMOVE',
  { id: string }
>

export type AudioNodeUpdateLabelAction = ActionWithPayload<
  'AUDIO_NODE_UPDATE_LABEL',
  { id: string; label: string }
>

export type AudioNodeUpdateAudioPropsAction = ActionWithPayload<
  'AUDIO_NODE_UPDATE_AUDIO_PROPS',
  { id: string; audioProps: Record<string, unknown> }
>

export type AudioNodesAction =
  | AudioNodeAddAction
  | AudioNodeDuplicateAction
  | AudioNodeRemoveAction
  | AudioNodeUpdateLabelAction
  | AudioNodeUpdateAudioPropsAction
