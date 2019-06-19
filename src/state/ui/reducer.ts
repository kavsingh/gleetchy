import produce from 'immer'
import { Reducer } from 'redux'

import defaultTheme, { ThemeName } from '~/style/theme'

import { UIAction } from './types'

export interface UIState {
  currentThemeName: ThemeName
}

const defaultState: UIState = {
  currentThemeName: defaultTheme.name,
}

const UIReducer: Reducer<UIState, UIAction> = (
  state = defaultState,
  action,
): UIState => {
  switch (action.type) {
    case 'UI_SET_THEME':
      return produce<UIState>(state, draftState => {
        draftState.currentThemeName = action.payload
      })
    default:
      return state
  }
}

export default UIReducer
