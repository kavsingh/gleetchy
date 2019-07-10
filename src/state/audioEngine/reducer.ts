import { Reducer } from 'redux'
import produce from 'immer'

import { AudioFilesAction } from '../audioFiles/types'
import { ConnectionsAction } from '../connections/types'
import { GlobalPlaybackAction } from '../globalPlayback/types'
import { AudioNodesAction } from '../audioNodes/types'
import { AudioEngineAction, AudioEngineEvent } from './types'

export interface AudioEngineState {
  events: AudioEngineEvent[]
}

const defaultState = { events: [] }

const audioEngineReducer: Reducer<
  AudioEngineState,
  | AudioNodesAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
  | AudioEngineAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'AUDIO_NODE_ADD':
    case 'AUDIO_NODE_REMOVE':
    case 'AUDIO_NODE_UPDATE_AUDIO_PROPS':
    case 'CONNECTION_ADD':
    case 'CONNECTION_REMOVE':
    case 'AUDIO_FILE_DECODE_COMPLETE':
    case 'GLOBAL_PLAYBACK_START':
    case 'GLOBAL_PLAYBACK_STOP': {
      return produce(state, draftState => {
        draftState.events.push(action as AudioEngineEvent)
      })
    }
    case 'AUDIO_ENGINE_CLEAR_EVENTS':
      return produce(state, draftState => {
        if (draftState.events.length) draftState.events = []
      })
    default:
      return state
  }
}

export default audioEngineReducer
