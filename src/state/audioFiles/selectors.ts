import { prop } from 'ramda'
import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configureStore'

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
  prop('decodeErrors'),
)
