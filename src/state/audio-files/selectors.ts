import { prop } from 'ramda'
import { createSelector } from 'reselect'

import type { ApplicationState } from '~/state/configure-store'

const audioFilesStateSelector = (state: ApplicationState) => state.audioFiles

export const audioFilesSelector = createSelector(
  audioFilesStateSelector,
  prop('files'),
)

export const audioFilesLoadingSelector = createSelector(
  audioFilesStateSelector,
  prop('loadingIds'),
)

export const audioFilesErrorSelector = createSelector(
  audioFilesStateSelector,
  (state) => ({ ...state.loadErrors, ...state.decodeErrors }),
)
