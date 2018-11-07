import React from 'react'

import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'

import {
  ApplicationState,
  ApplicationStore,
  configureStore,
} from '~/state/configureStore'

import MainComp, { applyGlobalStyles } from './Main'

const Main = MainComp as any

export default (initialState: Partial<ApplicationState> = {}) => {
  const store: ApplicationStore = configureStore(initialState)

  applyGlobalStyles()

  return renderStylesToString(renderToString(<Main store={store} />))
}
