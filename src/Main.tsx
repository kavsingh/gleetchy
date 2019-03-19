import React, { FunctionComponent, memo } from 'react'

import { injectGlobal } from 'emotion'
import { Provider } from 'react-redux'
import { once } from 'ramda'

import ErrorBoundary from '~/components/ErrorBoundary'
import { COLOR_PAGE } from '~/constants/style'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'
import { ApplicationStore } from '~/state/configureStore'

const applyGlobalStyles = once(
  () => injectGlobal`
  html {
    box-sizing: border-box;
    user-select: none;
    cursor: default;
    font-size: 14px;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    user-select: inherit;
    cursor: inherit;
  }

  *:focus,
  *:active {
    outline: none;
  }

  a,
  button {
    cursor: initial;
  }

  html,
  body {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    background-color: ${COLOR_PAGE};
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`,
)

//

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => {
  applyGlobalStyles()

  return (
    <Provider store={store}>
      <div>
        <ErrorBoundary>
          <AudioEngine />
        </ErrorBoundary>
        <ErrorBoundary>
          <UI />
        </ErrorBoundary>
      </div>
    </Provider>
  )
}

export default memo(Main)
