import { Action } from 'redux'

import { ActionWithPayload } from '~/types'
import { AudioNodesAction } from '~/state/audio-nodes/types'
import { AudioFilesAction } from '~/state/audio-files/types'
import { GlobalPlaybackAction } from '~/state/global-playback/types'

import { ConnectionsAction } from '../connections/types'

export type AudioEngineClearEventsAction = Action<'AUDIO_ENGINE_CLEAR_EVENTS'>

export type AudioEngineSubscriptionEventAction = ActionWithPayload<
  'AUDIO_ENGINE_SUBSCRIPTION_EVENT',
  { nodeId: string; subscriptionPayload: { [key: string]: unknown } }
>

export type AudioEngineAction =
  | AudioEngineClearEventsAction
  | AudioEngineSubscriptionEventAction

export type AudioEngineEvent =
  | AudioNodesAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
