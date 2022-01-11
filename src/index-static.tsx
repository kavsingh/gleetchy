import { renderToString } from 'react-dom/server'

import { configureStore } from '~/state/configure-store'

import App from './app'

import type { ApplicationState } from '~/state/configure-store'

export default (initialState: Partial<ApplicationState> = {}): string =>
  renderToString(<App store={configureStore(initialState)} />)
