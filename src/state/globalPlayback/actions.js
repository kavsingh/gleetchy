import { GLOBAL_PLAYBACK_START, GLOBAL_PLAYBACK_STOP } from './actionTypes'
import { isPlayingSelector } from './selectors'

export const startGlobalPlaybackAction = () => ({
  type: GLOBAL_PLAYBACK_START,
})

export const stopGlobalPlaybackAction = () => ({
  type: GLOBAL_PLAYBACK_STOP,
})

export const toggleGlobalPaybackAction = () => (dispatch, getState) => {
  const isPlaying = isPlayingSelector(getState())

  if (isPlaying) dispatch(stopGlobalPlaybackAction())
  else dispatch(startGlobalPlaybackAction())
}
