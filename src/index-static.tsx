import React from 'react'
import { renderToString } from 'react-dom/server'

import { ApplicationState, configureStore } from '~/state/configure-store'

import App from './app'

export default (initialState: Partial<ApplicationState> = {}) =>
  renderToString(<App store={configureStore(initialState)} />)
