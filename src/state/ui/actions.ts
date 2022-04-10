import type { ActionCreatorWithArguments } from '~/types'
import type { ActionCreator } from 'redux'
import type {
  UISetThemeAction,
  UIToggleThemeAction,
  UIKeyPressedAction,
  UIKeyReleasedAction,
} from './types'

export const setDarkThemeAction: ActionCreator<UISetThemeAction> = () => ({
  type: 'UI_SET_THEME',
  payload: 'dark',
})

export const setLightThemeAction: ActionCreator<UISetThemeAction> = () => ({
  type: 'UI_SET_THEME',
  payload: 'light',
})

export const toggleThemeAction: ActionCreator<UIToggleThemeAction> = () => ({
  type: 'UI_TOGGLE_THEME',
})

export const registerKeyPressAction: ActionCreatorWithArguments<
  UIKeyPressedAction,
  [string]
> = (key) => ({ type: 'UI_KEY_PRESSED', payload: key })

export const registerKeyReleaseAction: ActionCreatorWithArguments<
  UIKeyReleasedAction,
  [string]
> = (key) => ({ type: 'UI_KEY_RELEASED', payload: key })
