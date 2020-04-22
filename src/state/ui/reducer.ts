import { produce } from 'immer'
import type { Reducer } from 'redux'

import { getPreferredColorScheme } from '~/apis/color-scheme'
import defaultTheme from '~/style/theme'
import type { ThemeName } from '~/style/theme'
import { ModifierKey } from '~/lib/constants'
import { stableWithout } from '~/lib/util'

import type { UIAction } from './types'

const isModifierKey = (key: string): key is ModifierKey =>
  Object.values(ModifierKey).includes(key as ModifierKey)

export interface UIState {
  currentThemeName: ThemeName
  modifierKeys: ModifierKey[]
}

const getInitialTheme = (): ThemeName => {
  const preferred = getPreferredColorScheme()

  if (preferred === 'no-preference') return defaultTheme.name

  return preferred === 'light' ? 'light' : 'dark'
}

const defaultState: UIState = {
  currentThemeName: getInitialTheme(),
  modifierKeys: [],
}

export const uiReducer: Reducer<UIState, UIAction> = (
  state = defaultState,
  action,
) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'UI_SET_THEME':
        draftState.currentThemeName = action.payload
        break
      case 'UI_KEY_PRESSED': {
        const key = action.payload

        if (!isModifierKey(key)) break

        if (!draftState.modifierKeys.includes(key)) {
          draftState.modifierKeys.push(key)
        }
        break
      }
      case 'UI_KEY_RELEASED':
        draftState.modifierKeys = stableWithout(
          [action.payload],
          draftState.modifierKeys,
        )
        break
      default:
        break
    }
  })
