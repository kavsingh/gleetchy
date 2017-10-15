import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { playbackToggle } from '../../state/gleetchy/actions'
import {
  isPlayingSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import PlayPauseButton from '../../components/PlayPauseButton'
import Instruments from '../Instruments'
import FX from '../FX'
import PatchBay from '../PatchBay'

const GleetchyUI = ({ isPlaying, togglePlayback }) => (
  <div className="gleetchy">
    <div className="gleetchy__mastheadContainer">
      <div className="gleetchy__masthead">
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
    <div className="gleetchy__instrumentsContainer">
      <Instruments />
    </div>
    <div className="gleetchy__connectContainer">
      <div
        className="gleetchy_fxContainer"
        style={{ flexGrow: 1, flexShrink: 0 }}
      >
        <FX />
      </div>
      <div
        className="gleetchy_patchBayContainer"
        style={{ flexGrow: 0, flexShrink: 0 }}
      >
        <PatchBay />
      </div>
    </div>
    <style jsx>{`
      .gleetchy {
        max-width: 92em;
        margin: 0 auto;
        padding: 0 2em;
        color: #555;
      }

      .gleetchy__mastheadContainer,
      .gleetchy__instrumentsContainer {
        padding: 1em 0;
        border-bottom: 1px solid #fee;
      }

      .gleetchy__instrumentsContainer {
        max-height: 36em;
        overflow-y: scroll;
      }

      .gleetchy__connectContainer {
        display: flex;
        padding: 2em 0;
      }

      .gleetchy__masthead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .gleetchy__masthead a {
        transition: opacity 0.2s ease-out, color 0.2s ease-out;
        color: #555;
        opacity: 0.4;
      }

      .gleetchy__masthead a:hover {
        color: #333;
        opacity: 1;
      }
    `}</style>
  </div>
)

GleetchyUI.propTypes = {
  isPlaying: PropTypes.bool,
  togglePlayback: PropTypes.func,
}

GleetchyUI.defaultProps = {
  isPlaying: false,
  togglePlayback: () => {},
}

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
  }),
)(GleetchyUI)
