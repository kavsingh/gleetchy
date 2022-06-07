import { createSlice } from '@reduxjs/toolkit'

import { getPreferredColorScheme } from '~/apis/color-scheme'
import { ModifierKey } from '~/lib/constants'
import { defaultTheme } from '~/style/theme'
import { stableAppendUnique, stableWithout } from '~/lib/util'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { ThemeName } from '~/style/theme'

const getInitialTheme = (): ThemeName => {
  const preferred = getPreferredColorScheme()

  if (preferred === 'no-preference') return defaultTheme.name

  return preferred === 'light' ? 'light' : 'dark'
}

const initialState: UIState = {
  currentThemeName: getInitialTheme(),
  modifierKeys: [],
}

export const uiSlice = createSlice({
  initialState,
  name: 'ui',
  reducers: {
    setDarkTheme: (state) => {
      state.currentThemeName = 'dark'
    },
    setLightTheme: (state) => {
      state.currentThemeName = 'light'
    },
    toggleTheme: (state) => {
      state.currentThemeName =
        state.currentThemeName === 'light' ? 'dark' : 'light'
    },
    registerKeyPress: (state, action: PayloadAction<string>) => {
      const key = action.payload

      if (!isModifierKey(key)) return

      state.modifierKeys = stableAppendUnique([key], state.modifierKeys)
    },
    registerKeyRelease: (state, action: PayloadAction<string>) => {
      state.modifierKeys = stableWithout<ModifierKey>(
        [action.payload as ModifierKey],
        state.modifierKeys,
      )
    },
  },
})

interface UIState {
  currentThemeName: ThemeName
  modifierKeys: ModifierKey[]
}

const isModifierKey = (key: string): key is ModifierKey =>
  Object.values(ModifierKey).includes(key as ModifierKey)
