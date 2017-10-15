import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { playbackToggle } from '../../state/gleetchy/actions'
import {
  isPlayingSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import Panel from '../../components/Panel'
import PlayPauseButton from '../../components/PlayPauseButton'
import Instruments from '../Instruments'
import FX from '../FX'
import PatchBay from '../PatchBay'

const GleetchyUI = ({ isPlaying, togglePlayback }) => (
  <div className="gleetchy">
    <Panel>
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
    </Panel>
    <Panel
      style={{
        borderTop: '1px solid #fee',
        paddingBottom: 0,
      }}
    >
      <Instruments />
    </Panel>
    <Panel
      style={{
        marginTop: '2em',
        borderTop: '1px solid #fee',
        padding: 0,
      }}
    >
      <Panel style={{ flexGrow: 1, flexShrink: 0 }}>
        <FX />
      </Panel>
      <Panel style={{ flexGrow: 0, flexShrink: 0 }}>
        <PatchBay />
      </Panel>
    </Panel>
    <style jsx>{`
      .gleetchy {
        max-width: 92em;
        margin: 0 auto;
        padding: 0 2em;
        color: #555;
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
