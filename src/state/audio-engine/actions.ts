import type {
  AudioEngineClearEventsAction,
  AudioEngineSubscriptionEventAction,
} from './types'

export const clearAudioEngineEventsAction = (): AudioEngineClearEventsAction => ({
  type: 'AUDIO_ENGINE_CLEAR_EVENTS',
})

export const dispatchAudioEngineSubscriptionAction = <
  P extends { [key: string]: unknown }
>(
  nodeId: string,
  subscriptionPayload: P,
): AudioEngineSubscriptionEventAction => ({
  type: 'AUDIO_ENGINE_SUBSCRIPTION_EVENT',
  payload: { nodeId, subscriptionPayload },
})
