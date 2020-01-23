import React, { FunctionComponent, memo } from 'react'
import { Provider } from 'react-redux'

import { ApplicationStore } from '~/state/configure-store'
import AudioEngine from '~/audio-engine'
import UI from '~/ui'

import ErrorBoundary from './components/error-boundary'

const App: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <ErrorBoundary>
      <AudioEngine />
    </ErrorBoundary>
    <ErrorBoundary>
      <UI />
    </ErrorBoundary>
  </Provider>
)

export default memo(App)
