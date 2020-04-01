import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

import type { ApplicationState } from '~/state/configure-store'

import { isPlayingSelector } from './selectors'
import { GlobalPlaybackStartAction, GlobalPlaybackStopAction } from './types'

export const startGlobalPlaybackAction: ActionCreator<GlobalPlaybackStartAction> = () => ({
  type: 'GLOBAL_PLAYBACK_START',
})

export const stopGlobalPlaybackAction: ActionCreator<GlobalPlaybackStopAction> = () => ({
  type: 'GLOBAL_PLAYBACK_STOP',
})

export const toggleGlobalPlaybackAction = (): ThunkAction<
  void,
  ApplicationState,
  undefined,
  GlobalPlaybackStartAction | GlobalPlaybackStopAction
> => (dispatch, getState) => {
  const isPlaying = isPlayingSelector(getState())

  if (isPlaying) {
    dispatch<GlobalPlaybackStopAction>(stopGlobalPlaybackAction())
  } else {
    dispatch<GlobalPlaybackStartAction>(startGlobalPlaybackAction())
  }
}
