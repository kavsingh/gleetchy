import {
  AudioEngineClearEventsAction,
  AudioEngineSubscriptionEventAction,
} from './types'

export const clearAudioEngineEventsAction = (): AudioEngineClearEventsAction => ({
  type: 'AUDIO_ENGINE_CLEAR_EVENTS',
})

export const dispatchAudioEngineSubscriptionAction = (
  nodeId: string,
  subscriptionPayload: any,
): AudioEngineSubscriptionEventAction => ({
  type: 'AUDIO_ENGINE_SUBSCRIPTION_EVENT',
  payload: { nodeId, subscriptionPayload },
})
