import { memo } from 'react'
import { Provider } from 'react-redux'

import AudioEngine from '~/audio-engine'
import UI from '~/ui'

import StyledContainer from './style/styled-container'
import ErrorBoundary from './components/error-boundary'

import type { VoidFunctionComponent } from 'react'
import type { ApplicationStore } from '~/state/configure-store'

const App: VoidFunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
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
