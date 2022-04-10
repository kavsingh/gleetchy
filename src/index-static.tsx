import { renderToString } from 'react-dom/server'

import { configureStore } from '~/state/configure-store'

import App from './app'

import type { AppState } from '~/state/configure-store'

export default (initialState: Partial<AppState> = {}): string =>
  renderToString(<App store={configureStore(initialState)} />)
