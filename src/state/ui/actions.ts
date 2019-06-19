import { ThunkAction } from 'redux-thunk'

import { ApplicationState } from '../configureStore'
import { UISetThemeAction } from './types'
import { uiThemeNameSelector } from './selectors'

export const toggleDarkLightUIThemes = (): ThunkAction<
  void,
  ApplicationState,
  undefined,
  UISetThemeAction
> => (dispatch, getState) => {
  const themeName = uiThemeNameSelector(getState())

  if (themeName === 'dark') {
    dispatch<UISetThemeAction>({ payload: 'light', type: 'UI_SET_THEME' })
  } else {
    dispatch<UISetThemeAction>({ payload: 'dark', type: 'UI_SET_THEME' })
  }
}
