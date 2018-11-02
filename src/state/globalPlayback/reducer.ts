import { Reducer } from 'redux'

import { GlobalPlaybackAction } from './types'

export interface GlobalPlaybackState {
  isPlaying: boolean
}

const defaultState: GlobalPlaybackState = { isPlaying: false }

const globalPlaybackReducer: Reducer<
  GlobalPlaybackState,
  GlobalPlaybackAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case 'GLOBAL_PLAYBACK_START':
      return state.isPlaying ? state : { isPlaying: true }
    case 'GLOBAL_PLAYBACK_STOP':
      return state.isPlaying ? { isPlaying: false } : state
    default:
      return state
  }
}

export default globalPlaybackReducer
