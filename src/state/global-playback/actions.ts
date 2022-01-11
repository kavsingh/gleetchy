import { selectIsPlaying } from './selectors'

import type { ActionCreator } from 'redux'
import type { ThunkAction } from 'redux-thunk'
import type { ApplicationState } from '~/state/configure-store'
import type {
  GlobalPlaybackStartAction,
  GlobalPlaybackStopAction,
} from './types'

export const startGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStartAction
> = () => ({
  type: 'GLOBAL_PLAYBACK_START',
})

export const stopGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStopAction
> = () => ({
  type: 'GLOBAL_PLAYBACK_STOP',
})

export const toggleGlobalPlaybackAction =
  (): ThunkAction<
    void,
    ApplicationState,
    undefined,
    GlobalPlaybackStartAction | GlobalPlaybackStopAction
  > =>
  (dispatch, getState) => {
    const isPlaying = selectIsPlaying(getState())

    if (isPlaying) {
      dispatch<GlobalPlaybackStopAction>(stopGlobalPlaybackAction())
    } else {
      dispatch<GlobalPlaybackStartAction>(startGlobalPlaybackAction())
    }
  }
