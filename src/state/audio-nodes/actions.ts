import { nodeType as loopType } from '~/nodes/instruments/loop'
import { nodeType as delayType } from '~/nodes/audio-effects/delay'
import { nodeType as reverbType } from '~/nodes/audio-effects/reverb'

import type {
  AudioNodeAddAction,
  AudioNodeDuplicateAction,
  AudioNodeRemoveAction,
  AudioNodeUpdateLabelAction,
  AudioNodeUpdateAudioPropsAction,
} from './types'

export const addAudioNodeAction = (type: string): AudioNodeAddAction => ({
  payload: { type },
  type: 'AUDIO_NODE_ADD',
})

export const duplicateAudioNodeAction = (
  id: string,
): AudioNodeDuplicateAction => ({
  payload: { id },
  type: 'AUDIO_NODE_DUPLICATE',
})

export const addDelayAction = () => addAudioNodeAction(delayType)

export const addReverbAction = () => addAudioNodeAction(reverbType)

export const addLoopAction = () => addAudioNodeAction(loopType)

export const removeAudioNodeAction = (id: string): AudioNodeRemoveAction => ({
  payload: { id },
  type: 'AUDIO_NODE_REMOVE',
})

export const updateAudioNodeAudioPropsAction = (
  id: string,
  audioProps: object,
): AudioNodeUpdateAudioPropsAction => ({
  payload: { id, audioProps },
  type: 'AUDIO_NODE_UPDATE_AUDIO_PROPS',
})

export const updateAudioNodeLabelAction = (
  id: string,
  label: string,
): AudioNodeUpdateLabelAction => ({
  payload: { id, label },
  type: 'AUDIO_NODE_UPDATE_LABEL',
})
