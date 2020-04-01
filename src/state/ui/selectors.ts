import { createSelector } from 'reselect'
import { memoizeWith, identity } from 'ramda'

import { themes } from '~/style/theme'
import type { ApplicationState } from '~/state/configure-store'
import type { ThemeName } from '~/style/theme'

const getTheme = memoizeWith(
  identity,
  (themeName: ThemeName) =>
    themes.find((theme) => theme.name === themeName) || themes[0],
)

const uiStateSelector = (state: ApplicationState) => state.ui

export const uiThemeNameSelector = createSelector(
  uiStateSelector,
  ({ currentThemeName }) => currentThemeName,
)

export const uiThemeSelector = createSelector(
  uiThemeNameSelector,
  (themeName) => getTheme(themeName),
)
