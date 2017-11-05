import React from 'react'
import Favicon from 'react-favicon'
import GithubIcon from 'react-icons/lib/go/mark-github'
import PropTypes from '~/PropTypes'
import { COLOR_BODY, COLOR_KEYLINE } from '~/constants/style'
import { noop } from '~/util/function'
import PlayPauseButton from '~/components/PlayPauseButton'
import InstrumentsRack from '~/containers/InstrumentsRack'
import AudioEffectsRack from '~/containers/AudioEffectsRack'
import PatchBay from '~/containers/PatchBay'
import favicon from '~/assets/icons/48x48.png'

const UI = ({ isPlaying, togglePlayback }) => (
  <div className="ui">
    <Favicon url={[favicon]} />
    <div className="ui__mastheadContainer">
      <div className="ui__masthead">
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
    <div className="ui__instrumentsRackContainer">
      <InstrumentsRack />
    </div>
    <div className="ui__connectContainer">
      <div className="ui__audioEffectsRackContainer">
        <AudioEffectsRack />
      </div>
      <div className="ui__patchBayContainer">
        <PatchBay />
      </div>
    </div>
    <style jsx>{`
      .ui {
        max-width: 92em;
        margin: 0 auto;
        padding: 0 2em;
        color: ${COLOR_BODY};
      }

      .ui__mastheadContainer,
      .ui__instrumentsRackContainer {
        padding: 1em 0;
        border-bottom: 1px solid ${COLOR_KEYLINE};
      }

      .ui__connectContainer {
        display: flex;
        flex-wrap: wrap;
        padding: 2em 0;
      }

      .ui__audioEffectsRackContainer {
        flex-grow: 1;
        flex-shrink: 1;
      }

      .ui__patchBayContainer {
        flex-grow: 0;
        flex-shrink: 0;
      }

      .ui__masthead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ui__masthead a {
        transition: opacity 0.2s ease-out;
        color: ${COLOR_BODY};
        opacity: 0.4;
      }

      .ui__masthead a:hover {
        opacity: 1;
      }
    `}</style>
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

export default UI
