import type { ActionCreator } from 'redux'
import type { ThunkAction } from 'redux-thunk'

import { uiThemeNameSelector } from './selectors'
import type { ApplicationState } from '../configure-store'
import type { UISetThemeAction } from './types'

export const setDarkThemeAction: ActionCreator<UISetThemeAction> = () => ({
  payload: 'dark',
  type: 'UI_SET_THEME',
})

export const setLightThemeAction: ActionCreator<UISetThemeAction> = () => ({
  payload: 'light',
  type: 'UI_SET_THEME',
})

export const toggleDarkLightUIThemesAction = (): ThunkAction<
  void,
  ApplicationState,
  undefined,
  UISetThemeAction
> => (dispatch, getState) => {
  const themeName = uiThemeNameSelector(getState())

  if (themeName === 'dark') dispatch(setLightThemeAction())
  else dispatch(setDarkThemeAction())
}
