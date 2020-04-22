import type { ActionCreator } from 'redux'
import type { ThunkAction } from 'redux-thunk'

import { ActionCreatorWithArguments } from '~/types'

import { uiThemeNameSelector } from './selectors'
import type { ApplicationState } from '../configure-store'
import type {
  UISetThemeAction,
  UIKeyPressedAction,
  UIKeyReleasedAction,
} from './types'

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

export const registerKeyPressAction: ActionCreatorWithArguments<
  UIKeyPressedAction,
  [string]
> = (key) => ({ type: 'UI_KEY_PRESSED', payload: key })

export const registerKeyReleaseAction: ActionCreatorWithArguments<
  UIKeyReleasedAction,
  [string]
> = (key) => ({ type: 'UI_KEY_RELEASED', payload: key })
