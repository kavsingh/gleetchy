import { Dispatch } from 'redux'

import { ApplicationState } from '~/state/configureStore'

import { isPlayingSelector } from './selectors'
import { GlobalPlaybackStartAction, GlobalPlaybackStopAction } from './types'

export const startGlobalPlaybackAction = (): GlobalPlaybackStartAction => ({
  type: 'GLOBAL_PLAYBACK_START',
})

export const stopGlobalPlaybackAction = (): GlobalPlaybackStopAction => ({
  type: 'GLOBAL_PLAYBACK_STOP',
})

export const toggleGlobalPaybackAction = () => (
  dispatch: Dispatch,
  getState: () => ApplicationState,
) => {
  const isPlaying = isPlayingSelector(getState())

  if (isPlaying) {
    dispatch<GlobalPlaybackStopAction>(stopGlobalPlaybackAction())
  } else {
    dispatch<GlobalPlaybackStartAction>(startGlobalPlaybackAction())
  }
}
