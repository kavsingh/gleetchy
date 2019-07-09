import { Action } from 'redux'

import { AudioNodesAction } from '~/state/audioNodes/types'
import { AudioFilesAction } from '~/state/audioFiles/types'
import { GlobalPlaybackAction } from '~/state/globalPlayback/types'
import { ConnectionsAction } from '../connections/types'

export type AudioEngineClearEventsAction = Action<'AUDIO_ENGINE_CLEAR_EVENTS'>

export type AudioEngineAction = AudioEngineClearEventsAction

export type AudioEngineEvent =
  | AudioNodesAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
