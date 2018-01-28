import React from 'react'
import { renderToString } from 'react-dom/server'
import { renderStylesToString } from 'emotion-server'

import { configureStore } from '~/state/configureStore'

import Main, { applyGlobalStyles } from './Main'

export default (initialState = {}) => {
  const store = configureStore(initialState)

  applyGlobalStyles()

  return renderStylesToString(renderToString(<Main store={store} />))
}
