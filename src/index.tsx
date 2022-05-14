import { createRoot } from 'react-dom/client'

import { requireWindowWith } from '~/lib/env'
import { createStore } from '~/state/configure-store'

import App from './app'

const WINDOW = requireWindowWith(['document.getElementById'])

if (!WINDOW) throw new Error('Could not access dom')

const appRoot = WINDOW.document.getElementById('app-root')

if (!appRoot) throw new Error('Could not find app mount at #app-root')

const reactRoot = createRoot(appRoot)
const { ssrInitialState } = appRoot.dataset

delete appRoot.dataset.ssrInitialState

const parsedState: unknown = JSON.parse(ssrInitialState || '{}')
const initialState =
  parsedState && typeof parsedState === 'object' && !Array.isArray(parsedState)
    ? parsedState
    : {}

reactRoot.render(<App store={createStore(initialState)} />)
