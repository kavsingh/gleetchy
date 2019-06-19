import { ActionWithPayload } from '~/types'
import { ThemeName } from '~/style/theme'

export type UISetThemeAction = ActionWithPayload<'UI_SET_THEME', ThemeName>

export type UIAction = UISetThemeAction
