import React, { FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { css, Global } from '@emotion/core'
import { withTheme, ThemeProvider } from 'emotion-theming'

import useUITheme from '~/state/hooks/useUITheme'
import { UITheme } from '~/style/theme'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'
import ErrorBoundary from '~/components/ErrorBoundary'
import favicon from '~/assets/icons/48x48.png'

import Masthead from './Masthead'

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

const rootStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colorPage,
    color: theme.colorBody,
    fontFamily: theme.fontBody,
    margin: '0 auto',
    maxWidth: '92em',
    padding: '0 2em',
  })

const borderedSectionStyle = (theme: UITheme) =>
  css({
    borderBottom: `1px solid ${theme.colorKeyline}`,
    padding: '1em 0',
  })

const connectContainerStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '2em 0',
})

const audioEffectsRackContainerStyle = css({
  flexGrow: 1,
  flexShrink: 1,
})

const patchBayContainerStyle = css({
  flexGrow: 0,
  flexShrink: 0,
})

const UIMain: FunctionComponent = () => (
  <div css={rootStyle}>
    <Favicon url={favicon} />
    <div css={borderedSectionStyle}>
      <ErrorBoundary>
        <Masthead />
      </ErrorBoundary>
    </div>
    <div css={borderedSectionStyle}>
      <ErrorBoundary>
        <InstrumentsRack />
      </ErrorBoundary>
    </div>
    <div css={connectContainerStyle}>
      <div css={audioEffectsRackContainerStyle}>
        <ErrorBoundary>
          <AudioEffectsRack />
        </ErrorBoundary>
      </div>
      <div css={patchBayContainerStyle}>
        <ErrorBoundary>
          <PatchBay />
        </ErrorBoundary>
      </div>
    </div>
  </div>
)

const UIMainThemable = withTheme(UIMain)

const UI: FunctionComponent = () => {
  const [{ theme }] = useUITheme()

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <UIMainThemable />
    </ThemeProvider>
  )
}

export default UI
