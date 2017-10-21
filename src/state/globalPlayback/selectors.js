import { identity, prop } from 'ramda'
import { createSelector } from 'reselect'

const globalPlaybackStateSelector = state => state.globalPlayback

export const globalPlaybackSelector = createSelector(
  globalPlaybackStateSelector,
  identity,
)

export const isPlayingSelector = createSelector(
  globalPlaybackSelector,
  prop('isPlaying'),
)
