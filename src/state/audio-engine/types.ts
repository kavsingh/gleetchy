import { Action } from 'redux'

import { AudioNodesAction } from '~/state/audio-nodes/types'
import { AudioFilesAction } from '~/state/audio-files/types'
import { GlobalPlaybackAction } from '~/state/global-playback/types'

import { ConnectionsAction } from '../connections/types'

export type AudioEngineClearEventsAction = Action<'AUDIO_ENGINE_CLEAR_EVENTS'>

export type AudioEngineAction = AudioEngineClearEventsAction

export type AudioEngineEvent =
  | AudioNodesAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
