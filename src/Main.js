import React from 'react'
import { Provider } from 'react-redux'
import { injectGlobal } from 'emotion'

import PropTypes from '~/PropTypes'
import { COLOR_PAGE } from '~/constants/style'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'
import ErrorBoundary from '~/components/ErrorBoundary'

const container = document.createElement('div')
document.body.appendChild(container)

export const applyGlobalStyles = () => injectGlobal`
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
`

//

export default function Main({ store }) {
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

Main.propTypes = {
  store: PropTypes.shape({}).isRequired,
}
