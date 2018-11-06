import { Reducer } from 'redux'

import { AudioEffectsAction } from '~/state/audioEffects/types'
import { AudioFilesAction } from '~/state/audioFiles/types'
import { ConnectionsAction } from '~/state/connections/types'
import { GlobalPlaybackAction } from '~/state/globalPlayback/types'
import { InstrumentsAction } from '~/state/instruments/types'
import { AudioEngineEvent } from '~/types'

import { AudioEngineAction } from './types'

export interface AudioEngineState {
  events: AudioEngineEvent[]
}

const defaultState = { events: [] }

const audioEngineReducer: Reducer<
  AudioEngineState,
  | AudioEffectsAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
  | InstrumentsAction
  | AudioEngineAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'INSTRUMENT_ADD':
    case 'INSTRUMENT_REMOVE':
    case 'INSTRUMENT_UPDATE_PROPS':
    case 'AUDIO_EFFECT_ADD':
    case 'AUDIO_EFFECT_REMOVE':
    case 'AUDIO_EFFECT_UPDATE_PROPS':
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
