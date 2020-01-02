import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { ApplicationState } from '../configure-store'
import { UISetThemeAction } from './types'
import { uiThemeNameSelector } from './selectors'

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
