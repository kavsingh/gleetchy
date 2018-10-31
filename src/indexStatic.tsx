import React from 'react'

import { renderStylesToString } from 'emotion-server'
import pRenderToString from 'preact-render-to-string'
import { renderToString as rdRenderToString } from 'react-dom/server'
import { Store } from 'redux'

import { configureStore } from '~/state/configureStore'

import MainComp, { applyGlobalStyles } from './Main'

type StringRenderer = (...args: any) => string

const Main = MainComp as any

let renderToString: StringRenderer = pRenderToString as any

if (process.env.NODE_ENV !== 'production') {
  renderToString = rdRenderToString
}

export default (initialState = {}) => {
  const store: Store = configureStore(initialState)

  applyGlobalStyles()

  return renderStylesToString(renderToString(<Main store={store} />))
}