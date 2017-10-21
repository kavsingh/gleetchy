import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Favicon from 'react-favicon'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { COLOR_BODY, COLOR_KEYLINE } from '../../constants/style'
import { noop } from '../../util/function'
import { toggleGlobalPaybackAction } from '../../state/globalPlayback/actions'
import { isPlayingSelector } from '../../state/globalPlayback/selectors'
import favicon from '../../assets/icons/48x48.png'
import PlayPauseButton from '../../components/PlayPauseButton'
import Instruments from '../Instruments'
import FX from '../FX'
import PatchBay from '../PatchBay'

const GleetchyUI = ({ isPlaying, togglePlayback }) => (
  <div className="gleetchy">
    <Favicon url={[favicon]} />
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
      <div className="gleetchy__fxContainer">
        <FX />
      </div>
      <div className="gleetchy__patchBayContainer">
        <PatchBay />
      </div>
    </div>
    <style jsx>{`
      .gleetchy {
        max-width: 92em;
        margin: 0 auto;
        padding: 0 2em;
        color: ${COLOR_BODY};
      }

      .gleetchy__mastheadContainer,
      .gleetchy__instrumentsContainer {
        padding: 1em 0;
        border-bottom: 1px solid ${COLOR_KEYLINE};
      }

      .gleetchy__connectContainer {
        display: flex;
        flex-wrap: wrap;
        padding: 2em 0;
      }

      .gleetchy__fxContainer {
        flex-grow: 1;
        flex-shrink: 1;
      }

      .gleetchy__patchBayContainer {
        flex-grow: 0;
        flex-shrink: 0;
      }

      .gleetchy__masthead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .gleetchy__masthead a {
        transition: opacity 0.2s ease-out;
        color: ${COLOR_BODY};
        opacity: 0.4;
      }

      .gleetchy__masthead a:hover {
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
  togglePlayback: noop,
}

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(toggleGlobalPaybackAction()),
  }),
)(GleetchyUI)
