import React, { FunctionComponent, memo } from 'react'
import { Provider } from 'react-redux'

import { ApplicationStore } from '~/state/configureStore'
import ErrorBoundary from '~/components/ErrorBoundary'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'

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
