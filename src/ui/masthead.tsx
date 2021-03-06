import { memo } from 'react'
import { GoMarkGithub } from 'react-icons/go'
import styled from '@emotion/styled'

import useGlobalPlayback from '~/state/hooks/use-global-playback'
import useUITheme from '~/state/hooks/use-ui-theme'
import PlayPauseButton from '~/components/play-pause-button'
import type { FCWithoutChildren } from '~/types'
import type { ThemeProps } from '~/style/theme'

const Masthead: FCWithoutChildren = () => {
  const { isPlaying, togglePlayback } = useGlobalPlayback()
  const { toggleTheme } = useUITheme()

  return (
    <Container>
      <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
      <SideControlsContainer>
        <button onClick={toggleTheme}>L/D</button>
        <a
          href="https://www.github.com/kavsingh/gleetchy"
          target="_blank"
          rel="noopener noreferrer"
          title="view on github"
        >
          <GoMarkGithub />
        </a>
      </SideControlsContainer>
    </Container>
  )
}

export default memo(Masthead)

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const SideControlsContainer = styled.div<ThemeProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-self: stretch;

  a,
  button {
    display: block;
    color: ${({ theme }) => theme.colors.body};
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s ease-out;
    appearance: none;
  }

  button {
    margin: 0 1em 0 0;
    padding: 0;
    border: none;
    font-size: 0.8em;
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: transparent;
  }

  a:hover,
  button:hover {
    opacity: 1;
  }
`
