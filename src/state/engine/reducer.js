import { ENGINE_CLEAR_EVENTS } from './actionTypes'
import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
} from '../instruments/actionTypes'
import { FX_ADD, FX_REMOVE, FX_UPDATE_PROPS } from '../fx/actionTypes'
import { CONNECTION_ADD, CONNECTION_REMOVE } from '../connections/actionTypes'
import {
  GLOBAL_PLAYBACK_START,
  GLOBAL_PLAYBACK_STOP,
} from '../globalPlayback/actionTypes'
import { AUDIO_FILE_DECODE_COMPLETE } from '../audioFiles/actionTypes'

const defaultState = { events: [] }

/* eslint-disable complexity */
const engineReducer = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case INSTRUMENT_ADD:
    case INSTRUMENT_REMOVE:
    case INSTRUMENT_UPDATE_PROPS:
    case FX_ADD:
    case FX_REMOVE:
    case FX_UPDATE_PROPS:
    case CONNECTION_ADD:
    case CONNECTION_REMOVE:
    case GLOBAL_PLAYBACK_START:
    case GLOBAL_PLAYBACK_STOP:
    case AUDIO_FILE_DECODE_COMPLETE:
      return { ...state, events: state.events.concat({ type, payload }) }
    case ENGINE_CLEAR_EVENTS:
      return state.events.length ? { ...state, events: [] } : state
    default:
      return state
  }
}

export default engineReducer
