import React, { FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import { withTheme, ThemeProvider } from 'emotion-theming'

import useUITheme from '~/state/hooks/useUITheme'
import { UITheme } from '~/style/theme'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'
import favicon from '~/assets/icons/48x48.png'

import Masthead from './Masthead'

const globalStyles = (theme: UITheme) => css`
  html {
    box-sizing: border-box;
    font-size: 14px;
    cursor: default;
    user-select: none;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    cursor: inherit;
    user-select: inherit;
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
    margin: 0;
    padding: 0;
    background-color: ${theme.colorPage};
    -webkit-font-smoothing: antialiased;
  }
`

const Container = styled.div`
  max-width: 92em;
  margin: 0 auto;
  padding: 0 2em;
  color: ${props => (props.theme as UITheme).colorBody};
  font-family: ${props => (props.theme as UITheme).fontBody};
  background-color: ${props => (props.theme as UITheme).colorPage};
`

const BorderedSection = styled.div`
  padding: 1em 0;
  border-bottom: 1px solid ${props => (props.theme as UITheme).colorKeyline};
`

const ModContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 2em 0;
`

const AudioEffectsRackContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`

const PatchBayContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`

const UIMain: FunctionComponent = () => (
  <Container>
    <BorderedSection>
      <Masthead />
    </BorderedSection>
    <BorderedSection>
      <InstrumentsRack />
    </BorderedSection>
    <ModContainer>
      <AudioEffectsRackContainer>
        <AudioEffectsRack />
      </AudioEffectsRackContainer>
      <PatchBayContainer>
        <PatchBay />
      </PatchBayContainer>
    </ModContainer>
  </Container>
)

const UIMainThemable = withTheme(UIMain)

const UI: FunctionComponent = () => {
  const [{ theme }] = useUITheme()

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <Favicon url={favicon} />
      <UIMainThemable />
    </ThemeProvider>
  )
}

export default UI
