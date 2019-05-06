import React, { FunctionComponent, memo } from 'react'

import { Provider } from 'react-redux'
import { css, Global } from '@emotion/core'

import ErrorBoundary from '~/components/ErrorBoundary'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'
import { ApplicationStore } from '~/state/configureStore'

import { colorPage } from './style/color'

const globalStyles = css`
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
    background-color: ${colorPage};
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`

//

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <>
      <Global styles={globalStyles} />
      <ErrorBoundary>
        <AudioEngine />
      </ErrorBoundary>
      <ErrorBoundary>
        <UI />
      </ErrorBoundary>
    </>
  </Provider>
)

export default memo(Main)
