import React from 'react'
import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'

import { ApplicationState, configureStore } from '~/state/configureStore'

import Main from './Main'

export default (initialState: Partial<ApplicationState> = {}) =>
  renderStylesToString(
    renderToString(<Main store={configureStore(initialState)} />),
  )
