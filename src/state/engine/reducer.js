import { contains, __ } from 'ramda'
import { ENGINE_EVENTS_ADD, ENGINE_EVENTS_CLEAR } from './actionTypes'
import * as instrumentActionTypes from '../instruments/actionTypes'
import * as fxActionTypes from '../fx/actionTypes'
import * as connectionActionTypes from '../connections/actionTypes'
import * as globalPlaybackActionTypes from '../globalPlayback/actionTypes'

const shouldAddEngineEvent = contains(__, [
  instrumentActionTypes.INSTRUMENT_ADD,
  instrumentActionTypes.INSTRUMENT_REMOVE,
  instrumentActionTypes.INSTRUMENT_UPDATE_PROPS,
  fxActionTypes.FX_ADD,
  fxActionTypes.FX_REMOVE,
  fxActionTypes.FX_UPDATE_PROPS,
  connectionActionTypes.CONNECTION_ADD,
  connectionActionTypes.CONNECTION_REMOVE,
  connectionActionTypes.CONNECTION_REMOVE_ALL_FOR_ID,
  globalPlaybackActionTypes.GLOBAL_PLAYBACK_START,
  globalPlaybackActionTypes.GLOBAL_PLAYBACK_STOP,
])

const defaultState = []

const engineReducer = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case ENGINE_EVENTS_ADD:
      return payload.events.length ? state.concat(payload.events) : state
    case ENGINE_EVENTS_CLEAR:
      return state.length ? [] : state
    default:
      if (shouldAddEngineEvent(type)) return state.concat({ type, payload })
      return state
  }
}

export default engineReducer
