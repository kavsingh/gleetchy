import React, { memo, FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { css } from '@emotion/core'
import { GoMarkGithub } from 'react-icons/go'
import { withTheme } from 'emotion-theming'

import theme, { UITheme } from '~/style/theme'
import PlayPauseButton from '~/components/PlayPauseButton'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'

import favicon from '~/assets/icons/48x48.png'

const rootStyle = css({
  backgroundColor: theme.colorPage,
  color: theme.colorBody,
  fontFamily: theme.fontBody,
  margin: '0 auto',
  maxWidth: '92em',
  padding: '0 2em',
})

const borderedSectionStyle = css({
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

  '& a': {
    color: theme.colorBody,
    opacity: 0.4,
    transition: 'opacity 0.2s ease-out',
  },

  '& a:hover': {
    opacity: 1,
  },
})

export interface UIProps {
  isPlaying: boolean
  togglePlayback(): unknown
  theme: UITheme
}

const UI: FunctionComponent<UIProps> = ({
  isPlaying,
  togglePlayback,
  theme,
}) => (
  <div css={rootStyle}>
    <Favicon url={favicon} />
    <div css={borderedSectionStyle}>
      <div css={mastheadStyle}>
        <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
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
    <div css={borderedSectionStyle}>
      <InstrumentsRack />
    </div>
    <div css={connectContainerStyle}>
      <div css={audioEffectsRackContainerStyle}>
        <AudioEffectsRack />
      </div>
      <div css={patchBayContainerStyle}>
        <PatchBay />
      </div>
    </div>
  </div>
)

export default memo(withTheme(UI))
