import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GithubIcon from 'react-icons/lib/go/mark-github'
import {
  looperUpdateProps,
  looperLoadFile,
  playbackToggle,
} from '../../state/gleetchy/actions'
import PlayPauseButton from '../../components/PlayPauseButton'
import AudioLooper from '../../components/AudioLooper'
import classNames from './GleetchyUI.css'

const Panel = ({ children, style }) => (
  <div className={classNames.panel} style={{ ...style }}>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape(),
}

Panel.defaultProps = {
  children: [],
  style: {},
}

const GleetchyUI = ({
  loopers,
  isPlaying,
  togglePlayback,
  loadLooperAudio,
  updateLooper,
}) => (
  <div className={classNames.root}>
    <Panel>
      <div className={classNames.titleBar}>
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
    {loopers.map(
      (
        {
          loopStart,
          loopEnd,
          gain,
          fileName,
          fileType,
          audioBuffer,
          id,
          label,
          playbackRate,
        },
        index,
      ) => (
        <Panel
          style={{
            height: '24vh',
            minHeight: '10em',
            maxHeight: '20em',
            ...(index === 0
              ? { borderTop: '1px solid #fee' }
              : { marginTop: '1em' }),
          }}
          key={id}
        >
          <AudioLooper
            gain={gain}
            playbackRate={playbackRate}
            loopStart={loopStart}
            loopEnd={loopEnd}
            label={label}
            fileName={fileName}
            fileType={fileType}
            audioBuffer={audioBuffer}
            loadAudio={() => loadLooperAudio(id)}
            onGainChange={val => updateLooper(id, { gain: val })}
            onPlaybackRateChange={val =>
              updateLooper(id, { playbackRate: val })}
            onLoopRegionChange={(start, end) =>
              updateLooper(id, {
                loopStart: start,
                loopEnd: end,
              })}
          />
        </Panel>
      ),
    )}
  </div>
)

GleetchyUI.propTypes = {
  loopers: PropTypes.arrayOf(PropTypes.shape()),
  isPlaying: PropTypes.bool,
  togglePlayback: PropTypes.func,
  loadLooperAudio: PropTypes.func,
  updateLooper: PropTypes.func,
}

GleetchyUI.defaultProps = {
  loopers: [],
  isPlaying: false,
  togglePlayback: () => {},
  loadLooperAudio: () => {},
  updateLooper: () => {},
}

export default connect(
  ({ gleetchy }) => ({
    loopers: gleetchy.loopers,
    isPlaying: gleetchy.isPlaying,
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
    loadLooperAudio: id => dispatch(looperLoadFile(id)),
    updateLooper: (id, props) => dispatch(looperUpdateProps(id, props)),
  }),
)(GleetchyUI)
