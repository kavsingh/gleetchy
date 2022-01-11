import { themes } from '~/style/theme'

import type { ApplicationState } from '~/state/configure-store'

export const selectThemeName = (state: ApplicationState) =>
  state.ui.currentThemeName

export const selectTheme = (state: ApplicationState) =>
  themes[state.ui.currentThemeName]

export const selectModifierKeys = (state: ApplicationState) =>
  state.ui.modifierKeys
