import { GLOBAL_PLAYBACK_START, GLOBAL_PLAYBACK_STOP } from './actionTypes'

const defaultState = { isPlaying: false }

const globalPlaybackReducer = (state = defaultState, { type } = {}) => {
  switch (type) {
    case GLOBAL_PLAYBACK_START:
      return state.isPlaying ? state : { isPlaying: true }
    case GLOBAL_PLAYBACK_STOP:
      return state.isPlaying ? { isPlaying: false } : state
    default:
      return state
  }
}

export default globalPlaybackReducer
