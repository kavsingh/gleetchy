import type { Action } from 'redux'
import type { ActionWithPayload } from '~/types'
import type { ThemeName } from '~/style/theme'

export type UISetThemeAction = ActionWithPayload<'UI_SET_THEME', ThemeName>

export type UIToggleThemeAction = Action<'UI_TOGGLE_THEME'>

export type UIKeyPressedAction = ActionWithPayload<'UI_KEY_PRESSED', string>

export type UIKeyReleasedAction = ActionWithPayload<'UI_KEY_RELEASED', string>

export type UIAction =
  | UISetThemeAction
  | UIToggleThemeAction
  | UIKeyPressedAction
  | UIKeyReleasedAction
