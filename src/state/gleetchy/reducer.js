import { warn } from '../../util'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
  DELAY_UPDATE_PROPS,
} from './actionTypes'

const defaultState = {
  isPlaying: false,
  engineEvents: [],
  delay: { delayTime: 1, wetDryRatio: 0 },
  loopers: [
    {
      id: 'loop0',
      label: 'Loop 0',
      fileName: '',
      fileType: '',
      audioBuffer: undefined,
      gain: 0.5,
      loopStart: 0,
      loopEnd: 1,
      playbackRate: 1,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
    },
    {
      id: 'loop1',
      label: 'Loop 1',
      fileName: '',
      fileType: '',
      audioBuffer: undefined,
      gain: 0.5,
      loopStart: 0,
      loopEnd: 1,
      playbackRate: 1,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
    },
  ],
}

const updateLooper = (state, { id, props = {} }) => {
  const loopers = [...state.loopers]
  const looperState = state.loopers.find(looper => looper.id === id)

  if (!looperState) return state

  Object.assign(looperState, props)

  return { ...state, loopers }
}

const gleetchy = (state = defaultState, { type, payload = {} } = {}) => {
  switch (type) {
    case PLAYBACK_START:
      return {
        ...state,
        isPlaying: true,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case PLAYBACK_STOP:
      return {
        ...state,
        isPlaying: false,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_UPDATE_PROPS:
      return {
        ...updateLooper(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_COMPLETE:
      return {
        ...state,
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_DECODE_COMPLETE:
      return {
        ...updateLooper(state, payload),
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case LOOPER_LOAD_FILE_ERROR:
      warn(payload.error, type, payload)
      return state
    case DELAY_UPDATE_PROPS:
      return {
        ...state,
        delay: { ...state.delay, ...payload.props },
        engineEvents: [...state.engineEvents, { type, payload }],
      }
    case ENGINE_EVENTS_CLEAR:
      return { ...state, engineEvents: [] }
    default:
      return state
  }
}

export default gleetchy
