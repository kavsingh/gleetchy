import React, { memo, FunctionComponent } from 'react'
import Favicon from 'react-favicon'
import { GoMarkGithub } from 'react-icons/go'

import PlayPauseButton from '~/components/PlayPauseButton'
import { COLOR_BODY, COLOR_KEYLINE } from '~/constants/style'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import InstrumentsRack from '~/containers/InstrumentsRack'
import PatchBay from '~/containers/PatchBay'
import { cssLabeled } from '~/util/style'

import favicon from '~/assets/icons/48x48.png'

const classes = cssLabeled('ui', {
  root: {
    color: COLOR_BODY,
    margin: '0 auto',
    maxWidth: '92em',
    padding: '0 2em',
  },

  borderedSection: {
    borderBottom: `1px solid ${COLOR_KEYLINE}`,
    padding: '1em 0',
  },

  connectContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2em 0',
  },

  audioEffectsRackContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },

  patchBayContainer: {
    flexGrow: 0,
    flexShrink: 0,
  },

  masthead: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

    '& a': {
      color: COLOR_BODY,
      opacity: 0.4,
      transition: 'opacity 0.2s ease-out',
    },

    '& a:hover': {
      opacity: 1,
    },
  },
})

export interface UIProps {
  isPlaying: boolean
  togglePlayback(): unknown
}

const UI: FunctionComponent<UIProps> = ({ isPlaying, togglePlayback }) => (
  <div className={classes.root}>
    <Favicon url={favicon} />
    <div className={classes.borderedSection}>
      <div className={classes.masthead}>
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
    <div className={classes.borderedSection}>
      <InstrumentsRack />
    </div>
    <div className={classes.connectContainer}>
      <div className={classes.audioEffectsRackContainer}>
        <AudioEffectsRack />
      </div>
      <div className={classes.patchBayContainer}>
        <PatchBay />
      </div>
    </div>
  </div>
)

export default memo(UI)
