import { contains, __ } from 'ramda'
import { ENGINE_CLEAR_EVENTS } from './actionTypes'
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
  globalPlaybackActionTypes.GLOBAL_PLAYBACK_START,
  globalPlaybackActionTypes.GLOBAL_PLAYBACK_STOP,
])

const defaultState = { events: [] }

const engineReducer = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case ENGINE_CLEAR_EVENTS:
      return state.events.length ? { ...state, events: [] } : state
    default:
      if (shouldAddEngineEvent(type)) {
        return { ...state, events: state.events.concat({ type, payload }) }
      }
      return state
  }
}

export default engineReducer
