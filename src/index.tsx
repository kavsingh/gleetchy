import React from 'react'
import { render, hydrate } from 'react-dom'

import { requireWindowWith } from '~/util/env'
import offlineInstall from '~/lib/offline-install'
import { configureStore } from '~/state/configure-store'

import App from './app'

const WINDOW = requireWindowWith(['document.getElementById'])

if (!WINDOW) throw new Error('Could not access dom')

const appRoot = WINDOW.document.getElementById('app-root')

if (!appRoot) throw new Error('Could not find app mount at #app-root')

const ssrState = appRoot.getAttribute('data-initialstate')

offlineInstall('gleetchy-sw.js', '')

if (ssrState) {
  appRoot.removeAttribute('data-initialstate')
  hydrate(<App store={configureStore(JSON.parse(ssrState))} />, appRoot)
} else {
  render(<App store={configureStore()} />, appRoot)
}
