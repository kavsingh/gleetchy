import React from 'react'
import { renderToString as rdRenderToString } from 'react-dom/server'
import pRenderToString from 'preact-render-to-string'
import { renderStylesToString } from 'emotion-server'

import { configureStore } from '~/state/configureStore'

import Main, { applyGlobalStyles } from './Main'

let renderToString = pRenderToString
if (process.env.NODE_ENV !== 'production') renderToString = rdRenderToString

export default (initialState = {}) => {
  const store = configureStore(initialState)

  applyGlobalStyles()

  return renderStylesToString(renderToString(<Main store={store} />))
}
