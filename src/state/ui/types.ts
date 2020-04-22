import type { ActionWithPayload } from '~/types'
import type { ThemeName } from '~/style/theme'

export type UISetThemeAction = ActionWithPayload<'UI_SET_THEME', ThemeName>

export type UIKeyPressedAction = ActionWithPayload<'UI_KEY_PRESSED', string>

export type UIKeyReleasedAction = ActionWithPayload<'UI_KEY_RELEASED', string>

export type UIAction =
  | UISetThemeAction
  | UIKeyPressedAction
  | UIKeyReleasedAction
