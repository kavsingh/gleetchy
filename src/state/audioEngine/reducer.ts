import { Reducer } from 'redux'

import { AudioFilesAction } from '~/state/audioFiles/types'
import { ConnectionsAction } from '~/state/connections/types'
import { GlobalPlaybackAction } from '~/state/globalPlayback/types'
import { AudioEngineEvent } from '~/types'

import { AudioEngineAction } from './types'
import { AudioNodesAction } from '../audioNodes/types'

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
    case 'AUDIO_FILE_DECODE_COMPLETE': {
      const event: AudioEngineEvent<typeof action.payload> = {
        payload: action.payload,
        type: action.type,
      }

      return { ...state, events: state.events.concat(event) }
    }
    case 'GLOBAL_PLAYBACK_START':
    case 'GLOBAL_PLAYBACK_STOP': {
      const event: AudioEngineEvent<{}> = { type: action.type, payload: {} }

      return { ...state, events: state.events.concat(event) }
    }
    case 'AUDIO_ENGINE_CLEAR_EVENTS':
      return state.events.length ? { ...state, events: [] } : state
    default:
      return state
  }
}

export default audioEngineReducer
