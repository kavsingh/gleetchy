import themeDark, { themeLight } from '~/style/theme'

import { UISetThemeAction } from './types'

export const setDarkUITheme = (): UISetThemeAction => ({
  payload: themeDark,
  type: 'UI_SET_THEME',
})

export const setLightUITheme = (): UISetThemeAction => ({
  payload: themeLight,
  type: 'UI_SET_THEME',
})
