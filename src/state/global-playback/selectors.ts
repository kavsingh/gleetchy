import { identity, prop } from 'ramda'
import { createSelector } from 'reselect'

import type { ApplicationState } from '~/state/configure-store'

const globalPlaybackStateSelector = (state: ApplicationState) =>
  state.globalPlayback

export const globalPlaybackSelector = createSelector(
  globalPlaybackStateSelector,
  identity,
)

export const isPlayingSelector = createSelector(
  globalPlaybackSelector,
  prop('isPlaying'),
)
