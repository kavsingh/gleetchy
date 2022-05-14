import { memo, StrictMode } from 'react'
import { Provider } from 'react-redux'

import AudioEngine from '~/audio-engine'
import UI from '~/ui'

import StyledContainer from './style/styled-container'
import ErrorBoundary from './components/error-boundary'
import { AudioContextProvider } from './contexts/audio-context-context'

import type { FC } from 'react'
import type { AppStore } from '~/state/configure-store'

const App: FC<{ store: AppStore }> = ({ store }) => (
  <StrictMode>
    <AudioContextProvider>
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
    </AudioContextProvider>
  </StrictMode>
)

export default memo(App)
