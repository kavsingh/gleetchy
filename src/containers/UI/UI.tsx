import React, { memo, FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { GoMarkGithub } from 'react-icons/go'

import { colorBody, colorKeyline } from '~/style/color'
import PlayPauseButton from '~/components/PlayPauseButton'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'

import favicon from '~/assets/icons/48x48.png'
import { css } from 'emotion'

const rootStyle = css({
  color: colorBody,
  margin: '0 auto',
  maxWidth: '92em',
  padding: '0 2em',
})

const borderedSectionStyle = css({
  borderBottom: `1px solid ${colorKeyline}`,
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
    color: colorBody,
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
}

const UI: FunctionComponent<UIProps> = ({ isPlaying, togglePlayback }) => (
  <div className={rootStyle}>
    <Favicon url={favicon} />
    <div className={borderedSectionStyle}>
      <div className={mastheadStyle}>
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
    <div className={borderedSectionStyle}>
      <InstrumentsRack />
    </div>
    <div className={connectContainerStyle}>
      <div className={audioEffectsRackContainerStyle}>
        <AudioEffectsRack />
      </div>
      <div className={patchBayContainerStyle}>
        <PatchBay />
      </div>
    </div>
  </div>
)

export default memo(UI)
