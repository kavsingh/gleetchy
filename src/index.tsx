import { hydrateRoot } from 'react-dom/client'

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

delete appRoot.dataset.ssrInitialState

const parsedState: unknown = JSON.parse(ssrInitialState || '{}')
const initialState =
  parsedState && typeof parsedState === 'object' && !Array.isArray(parsedState)
    ? parsedState
    : {}

hydrateRoot(appRoot, <App store={configureStore(initialState)} />)
