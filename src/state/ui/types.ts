import type { ActionWithPayload } from '~/types'
import type { ThemeName } from '~/style/theme'

export type UISetThemeAction = ActionWithPayload<'UI_SET_THEME', ThemeName>

export type UIAction = UISetThemeAction
