import React from 'react'
import { render, hydrate } from 'react-dom'

import { configureStore } from '~/state/configureStore'
import offlineInstall from '~/util/offlineInstall'
import { requireWindowWith } from '~/util/env'

import Main from './Main'

const WINDOW = requireWindowWith([['document', 'getElementById']])

if (!WINDOW) {
  throw new Error('could not access dom')
}

const appRoot = WINDOW.document.getElementById('app-root')

if (!appRoot) {
  throw new Error('could not find app mount at app-root')
}

const ssrState = appRoot.getAttribute('data-ssr-state')

offlineInstall('gleetchy-sw.js', '')

if (ssrState) {
  appRoot.removeAttribute('data-ssr-state')
  hydrate(<Main store={configureStore(JSON.parse(ssrState))} />, appRoot)
} else {
  render(<Main store={configureStore()} />, appRoot)
}
