import { Reducer } from 'redux'
import produce from 'immer'

import { AudioFilesAction } from '../audio-files/types'
import { ConnectionsAction } from '../connections/types'
import { GlobalPlaybackAction } from '../global-playback/types'
import { AudioNodesAction } from '../audio-nodes/types'
import { AudioEngineAction, AudioEngineEvent } from './types'

export interface AudioEngineState {
  events: AudioEngineEvent[]
}

const defaultState = { events: [] }

export const audioEngineReducer: Reducer<
  AudioEngineState,
  | AudioNodesAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
  | AudioEngineAction
> = (state = defaultState, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'AUDIO_NODE_ADD':
      case 'AUDIO_NODE_DUPLICATE':
      case 'AUDIO_NODE_REMOVE':
      case 'AUDIO_NODE_UPDATE_AUDIO_PROPS':
      case 'CONNECTION_ADD':
      case 'CONNECTION_REMOVE':
      case 'AUDIO_FILE_DECODE_COMPLETE':
      case 'GLOBAL_PLAYBACK_START':
      case 'GLOBAL_PLAYBACK_STOP':
        draftState.events.push(action as AudioEngineEvent)
        break
      case 'AUDIO_ENGINE_CLEAR_EVENTS':
        if (draftState.events.length) draftState.events = []
        break
      default:
        break
    }
  })
