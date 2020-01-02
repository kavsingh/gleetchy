import React, { FunctionComponent, memo } from 'react'
import { Provider } from 'react-redux'

import { ApplicationStore } from '~/state/configureStore'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'

import ErrorBoundary from './components/error-boundary'

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <ErrorBoundary>
      <AudioEngine />
    </ErrorBoundary>
    <ErrorBoundary>
      <UI />
    </ErrorBoundary>
  </Provider>
)

export default memo(Main)
