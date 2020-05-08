import React, { FunctionComponent, memo } from 'react'
import { Provider } from 'react-redux'

import AudioEngine from '~/audio-engine'
import UI from '~/ui'
import type { ApplicationStore } from '~/state/configure-store'

import StyledContainer from './style/styled-container'
import ErrorBoundary from './components/error-boundary'

const App: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <StyledContainer>
      <ErrorBoundary>
        <AudioEngine />
      </ErrorBoundary>
      <ErrorBoundary>
        <UI />
      </ErrorBoundary>
    </StyledContainer>
  </Provider>
)

export default memo(App)
