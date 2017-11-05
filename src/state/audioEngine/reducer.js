import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
} from '~/state/instruments/actionTypes'
import {
  AUDIO_EFFECT_ADD,
  AUDIO_EFFECT_REMOVE,
  AUDIO_EFFECT_UPDATE_PROPS,
} from '~/state/audioEffects/actionTypes'
import {
  CONNECTION_ADD,
  CONNECTION_REMOVE,
} from '~/state/connections/actionTypes'
import {
  GLOBAL_PLAYBACK_START,
  GLOBAL_PLAYBACK_STOP,
} from '~/state/globalPlayback/actionTypes'
import { AUDIO_FILE_DECODE_COMPLETE } from '~/state/audioFiles/actionTypes'
import { AUDIO_ENGINE_CLEAR_EVENTS } from './actionTypes'

const defaultState = { events: [] }

/* eslint-disable complexity */
const audioEngineReducer = (
  state = defaultState,
  { type, payload = {} } = {},
) => {
  switch (type) {
    case INSTRUMENT_ADD:
    case INSTRUMENT_REMOVE:
    case INSTRUMENT_UPDATE_PROPS:
    case AUDIO_EFFECT_ADD:
    case AUDIO_EFFECT_REMOVE:
    case AUDIO_EFFECT_UPDATE_PROPS:
    case CONNECTION_ADD:
    case CONNECTION_REMOVE:
    case GLOBAL_PLAYBACK_START:
    case GLOBAL_PLAYBACK_STOP:
    case AUDIO_FILE_DECODE_COMPLETE:
      return { ...state, events: state.events.concat({ type, payload }) }
    case AUDIO_ENGINE_CLEAR_EVENTS:
      return state.events.length ? { ...state, events: [] } : state
    default:
      return state
  }
}

export default audioEngineReducer
