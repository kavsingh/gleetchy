import React, { memo, FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { css, Global } from '@emotion/core'
import { GoMarkGithub } from 'react-icons/go'
import { withTheme, ThemeProvider } from 'emotion-theming'

import favicon from '~/assets/icons/48x48.png'
import { UITheme } from '~/style/theme'
import PlayPauseButton from '~/components/PlayPauseButton'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'
import ErrorBoundary from '~/components/ErrorBoundary'

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

const mastheadStyle = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
})

const metaControlStyle = (theme: UITheme) =>
  css({
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    alignSelf: 'stretch',

    '& a, & button': {
      display: 'block',
      appearance: 'none',
      color: theme.colorBody,
      opacity: 0.4,
      transition: 'opacity 0.2s ease-out',
      cursor: 'pointer',
    },

    '& a:hover, & button:hover': {
      opacity: 1,
    },

    '& button': {
      backgroundColor: 'transparent',
      fontFamily: theme.fontBody,
      fontSize: '0.8em',
      margin: '0 1em 0 0',
      padding: 0,
      border: 'none',
    },
  })

interface UIMainProps {
  isPlaying: boolean
  togglePlayback(): unknown
  changeTheme(): unknown
}

const UIMain: FunctionComponent<UIMainProps> = ({
  isPlaying,
  togglePlayback,
  changeTheme,
}) => (
  <div css={rootStyle}>
    <Favicon url={favicon} />
    <div css={borderedSectionStyle}>
      <div css={mastheadStyle}>
        <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
        <div css={metaControlStyle}>
          <button onClick={changeTheme}>L/D</button>
          <a
            href="https://www.github.com/kavsingh/gleetchy"
            target="_blank"
            rel="noopener noreferrer"
            title="view on github"
          >
            <GoMarkGithub />
          </a>
        </div>
      </div>
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

const UIMainThemable = memo(withTheme(UIMain))

export interface UIProps extends UIMainProps {
  theme: UITheme
}

const UI: FunctionComponent<UIProps> = ({ theme, ...uiMainProps }) => (
  <ThemeProvider theme={theme}>
    <Global styles={globalStyles} />
    <ErrorBoundary>
      <UIMainThemable {...uiMainProps} />
    </ErrorBoundary>
  </ThemeProvider>
)

export default memo(UI)
