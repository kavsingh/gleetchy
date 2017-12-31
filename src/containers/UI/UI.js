import React from 'react'
import { pure } from 'recompose'
import Favicon from 'react-favicon'
import { css as emo } from 'react-emotion'
import GithubIcon from 'react-icons/lib/go/mark-github'

import PropTypes from '~/PropTypes'
import { COLOR_BODY, COLOR_KEYLINE } from '~/constants/style'
import { noop } from '~/util/function'
import PlayPauseButton from '~/components/PlayPauseButton'
import InstrumentsRack from '~/containers/InstrumentsRack'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import PatchBay from '~/containers/PatchBay'
import favicon from '~/assets/icons/48x48.png'

const classes = {
  root: emo({
    maxWidth: '92em',
    margin: '0 auto',
    padding: '0 2em',
    color: COLOR_BODY,
  }),

  borderedSection: emo({
    padding: '1em 0',
    borderBottom: `1px solid ${COLOR_KEYLINE}`,
  }),

  connectContainer: emo({
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2em 0',
  }),

  audioEffectsRackContainer: emo({
    flexGrow: 1,
    flexShrink: 1,
  }),

  patchBayContainer: emo({
    flexGrow: 0,
    flexShrink: 0,
  }),

  masthead: emo({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& a': {
      transition: 'opacity 0.2s ease-out',
      color: COLOR_BODY,
      opacity: 0.4,
    },

    '& a:hover': {
      opacity: 1,
    },
  }),
}

const UI = ({ isPlaying, togglePlayback }) => (
  <div className={classes.root}>
    <Favicon url={[favicon]} />
    <div className={classes.borderedSection}>
      <div className={classes.masthead}>
        <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayback} />
        <a
          href="https://www.github.com/kavsingh/gleetchy"
          target="_blank"
          rel="noopener noreferrer"
          title="view on github"
        >
          <GithubIcon />
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

UI.propTypes = {
  isPlaying: PropTypes.bool,
  togglePlayback: PropTypes.func,
}

UI.defaultProps = {
  isPlaying: false,
  togglePlayback: noop,
}

export default pure(UI)
