import { renderToString } from 'react-dom/server'

import { createStore } from '~/state/configure-store'

import App from './app'

import type { AppState } from '~/state/configure-store'

export default (initialState: Partial<AppState> = {}): string =>
  renderToString(<App store={createStore(initialState)} />)
