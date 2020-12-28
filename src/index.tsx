import { render, hydrate } from 'react-dom'

import { requireWindowWith } from '~/lib/env'
import offlineInstall from '~/lib/offline-install'
import { configureStore } from '~/state/configure-store'

import App from './app'

const WINDOW = requireWindowWith(['document.getElementById'])

if (!WINDOW) throw new Error('Could not access dom')

const appRoot = WINDOW.document.getElementById('app-root')

if (!appRoot) throw new Error('Could not find app mount at #app-root')

const { ssrInitialState } = appRoot.dataset

offlineInstall('gleetchy-sw.js', '')

if (ssrInitialState) {
  delete appRoot.dataset.ssrInitialState
  hydrate(<App store={configureStore(JSON.parse(ssrInitialState))} />, appRoot)
} else {
  render(<App store={configureStore()} />, appRoot)
}
