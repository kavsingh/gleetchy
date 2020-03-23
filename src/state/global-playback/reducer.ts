import { Reducer } from 'redux'
import { produce } from 'immer'

import { GlobalPlaybackAction } from './types'

export interface GlobalPlaybackState {
  isPlaying: boolean
}

const defaultState: GlobalPlaybackState = { isPlaying: false }

export const globalPlaybackReducer: Reducer<
  GlobalPlaybackState,
  GlobalPlaybackAction
> = (state = defaultState, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'GLOBAL_PLAYBACK_START':
        draftState.isPlaying = true
        break
      case 'GLOBAL_PLAYBACK_STOP':
        draftState.isPlaying = false
        break
      default:
        break
    }
  })
