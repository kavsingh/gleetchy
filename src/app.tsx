import { memo } from 'react'
import { Provider } from 'react-redux'

import AudioEngine from '~/audio-engine'
import UI from '~/ui'
import type { ApplicationStore } from '~/state/configure-store'

import StyledContainer from './style/styled-container'
import ErrorBoundary from './components/error-boundary'
import type { FCWithoutChildren } from './types'

const App: FCWithoutChildren<{ store: ApplicationStore }> = ({ store }) => (
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
