import { memo, useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import AudioEngine from '~/audio-engine'
import UI from '~/ui'
// @ts-expect-error worklet url import via webpack
// eslint-disable-next-line import/default
import loopProcessor from '~/nodes/instruments/loop/processor.worklet'

import StyledContainer from './style/styled-container'
import ErrorBoundary from './components/error-boundary'
import { getAudioContext } from './apis/audio'

import type { ApplicationStore } from '~/state/configure-store'
import type { FCWithoutChildren } from './types'

const App: FCWithoutChildren<{ store: ApplicationStore }> = ({ store }) => {
  const [workletsReady, setWorkletsReady] = useState(false)

  useEffect(() => {
    void getAudioContext()
      .audioWorklet.addModule(loopProcessor as string)
      .then(() => setWorkletsReady(true))
  }, [])

  return (
    <Provider store={store}>
      <StyledContainer>
        <ErrorBoundary>{workletsReady ? <AudioEngine /> : null}</ErrorBoundary>
        <ErrorBoundary>
          <UI />
        </ErrorBoundary>
      </StyledContainer>
    </Provider>
  )
}

export default memo(App)
