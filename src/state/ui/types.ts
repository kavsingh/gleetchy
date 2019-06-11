import { ActionWithPayload } from '~/types'
import { UITheme } from '~/style/theme'

export type UISetThemeAction = ActionWithPayload<'UI_SET_THEME', UITheme>

export type UIAction = UISetThemeAction
