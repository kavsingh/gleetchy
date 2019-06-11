import { createSelector } from 'reselect'

import { ApplicationState } from '~/state/configureStore'

const uiStateSelector = (state: ApplicationState) => state.ui

export const uiThemeSelector = createSelector(
  uiStateSelector,
  ({ theme }) => theme,
)
