import React, { FunctionComponent, memo, useState } from 'react'
import { css, Global } from '@emotion/core'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'emotion-theming'

import { ApplicationStore } from '~/state/configureStore'
import defaultTheme, { themeDark, themeLight, UITheme } from '~/style/theme'
import ErrorBoundary from '~/components/ErrorBoundary'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'

const globalStyles = (theme: UITheme) =>
  css({
    html: {
      boxSizing: 'border-box',
      userSelect: 'none',
      cursor: 'default',
      fontSize: '14px',
    },

    '*, *::before, *::after': {
      boxSizing: 'inherit',
      userSelect: 'inherit',
      cursor: 'inherit',
    },

    '*:focus, *:active': {
      outline: 'none',
    },

    'a, button': {
      cursor: 'initial',
    },

    'html, body': {
      width: '100%',
      padding: '0',
      margin: '0',
      backgroundColor: theme.colorPage,
      '-webkit-font-smoothing': 'antialiased',
    },
  })

//

const UIThemable: FunctionComponent = () => {
  const [theme, setTheme] = useState<UITheme>(defaultTheme)
  const handleChangeTheme = () => {
    setTheme(current => (current === themeDark ? themeLight : themeDark))
  }

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <UI changeTheme={handleChangeTheme} />
    </ThemeProvider>
  )
}

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <ErrorBoundary>
      <AudioEngine />
    </ErrorBoundary>
    <ErrorBoundary>
      <UIThemable />
    </ErrorBoundary>
  </Provider>
)

export default memo(Main)
