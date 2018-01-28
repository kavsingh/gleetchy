import React from 'react'
import { renderToString } from 'react-dom/server'
import { renderStyleToString } from 'emotion-server'

import { configureStore } from '~/state/configureStore'

import Main, { applyGlobalStyles } from './Main'

export default (initialState = {}) => {
  const store = configureStore(initialState)

  applyGlobalStyles()

  return renderStyleToString(renderToString(<Main store={store} />))
}
