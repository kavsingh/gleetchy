import { prop } from 'ramda'
import { createSelector } from 'reselect'

const audioFilesStateSelector = state => state.audioFiles

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
  prop('errors'),
)
