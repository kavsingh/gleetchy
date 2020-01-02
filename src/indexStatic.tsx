import React from 'react'
import { renderToString } from 'react-dom/server'

import { ApplicationState, configureStore } from '~/state/configure-store'

import Main from './Main'

export default (initialState: Partial<ApplicationState> = {}) =>
  renderToString(<Main store={configureStore(initialState)} />)
