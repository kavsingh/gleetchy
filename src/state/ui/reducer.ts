import produce from 'immer'
import { Reducer } from 'redux'

import defaultTheme, { UITheme } from '~/style/theme'

import { UIAction } from './types'

export interface UIState {
  theme: UITheme
}

const defaultState: UIState = {
  theme: defaultTheme,
}

const UIReducer: Reducer<UIState, UIAction> = (
  state = defaultState,
  action,
): UIState => {
  switch (action.type) {
    case 'UI_SET_THEME':
      return produce<UIState>(state, draftState => {
        Object.assign(draftState.theme, action.payload)
      })
    default:
      return state
  }
}

export default UIReducer
