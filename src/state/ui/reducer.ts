import { Reducer } from 'redux'
import { produce } from 'immer'

import { getPreferredColorScheme } from '~/apis/color-scheme'
import defaultTheme, { ThemeName } from '~/style/theme'

import { UIAction } from './types'

export interface UIState {
  currentThemeName: ThemeName
}

const getInitialTheme = (): ThemeName => {
  const preferred = getPreferredColorScheme()

  if (preferred === 'no-preference') return defaultTheme.name

  return preferred === 'light' ? 'light' : 'dark'
}

const defaultState: UIState = {
  currentThemeName: getInitialTheme(),
}

export const uiReducer: Reducer<UIState, UIAction> = (
  state = defaultState,
  action,
) =>
  produce(state, draftState => {
    switch (action.type) {
      case 'UI_SET_THEME':
        draftState.currentThemeName = action.payload
        break
      default:
        break
    }
  })
