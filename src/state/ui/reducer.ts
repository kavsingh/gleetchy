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

const UIReducer: Reducer<UIState, UIAction> = (state = defaultState, action) =>
  produce(state, draftState => {
    switch (action.type) {
      case 'UI_SET_THEME':
        draftState.currentThemeName = action.payload
        break
      default:
        break
    }
  })

export default UIReducer
