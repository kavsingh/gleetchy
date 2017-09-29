import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GithubIcon from 'react-icons/lib/go/mark-github'
import {
  looperUpdateProps,
  looperLoadFile,
  playbackToggle,
  delayUpdateProps,
  reverbUpdateProps,
} from '../../state/gleetchy/actions'
import PlayPauseButton from '../../components/PlayPauseButton'
import AudioLooper from '../../components/AudioLooper'
import Delay from '../../components/Delay'
import Reverb from '../../components/Reverb'
import ErrorBoundary from '../../components/ErrorBoundary'

const Panel = ({ children, style }) => (
  <div className="panel" style={{ ...style }}>
    {children}
    <style jsx>{`
      .panel {
        padding: 1.4em 0.4em;
        display: flex;
      }
    `}</style>
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
  delay,
  reverb,
  isPlaying,
  togglePlayback,
  loadLooperAudio,
  updateLooper,
  updateDelay,
  updateReverb,
}) => (
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
          eqLow,
          eqMid,
          eqHigh,
        },
        index,
      ) => (
        <Panel
          style={{
            height: '14em',
            ...(index === 0
              ? { borderTop: '1px solid #fee' }
              : { marginTop: '1em' }),
          }}
          key={id}
        >
          <ErrorBoundary>
            <AudioLooper
              gain={gain}
              eqLow={eqLow}
              eqMid={eqMid}
              eqHigh={eqHigh}
              playbackRate={playbackRate}
              loopStart={loopStart}
              loopEnd={loopEnd}
              label={label}
              fileName={fileName}
              fileType={fileType}
              audioBuffer={audioBuffer}
              selectAudioFile={() => loadLooperAudio(id)}
              receiveAudioFile={file => console.log(file)}
              onGainChange={val => updateLooper(id, { gain: val })}
              onPlaybackRateChange={val =>
                updateLooper(id, { playbackRate: val })}
              onLoopRegionChange={(start, end) =>
                updateLooper(id, {
                  loopStart: start,
                  loopEnd: end,
                })}
              onEqChange={props => updateLooper(id, props)}
            />
          </ErrorBoundary>
        </Panel>
      ),
    )}
    <Panel
      style={{
        marginTop: '2em',
        borderTop: '1px solid #fee',
        padding: 0,
      }}
    >
      <Panel style={{ width: '25%' }}>
        <Delay
          wetDryRatio={delay.wetDryRatio}
          delayTime={delay.delayTime}
          onDelayTimeChange={delayTime => updateDelay({ delayTime })}
          onWetDryRatioChange={wetDryRatio => updateDelay({ wetDryRatio })}
        />
      </Panel>
      <Panel style={{ width: '25%' }}>
        <Reverb
          wetDryRatio={reverb.wetDryRatio}
          onWetDryRatioChange={wetDryRatio => updateReverb({ wetDryRatio })}
        />
      </Panel>
    </Panel>
    <style jsx>{`
      .gleetchy {
        max-width: 62em;
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
  delay: PropTypes.shape(),
  reverb: PropTypes.shape(),
  loopers: PropTypes.arrayOf(PropTypes.shape()),
  isPlaying: PropTypes.bool,
  togglePlayback: PropTypes.func,
  loadLooperAudio: PropTypes.func,
  updateLooper: PropTypes.func,
  updateDelay: PropTypes.func,
  updateReverb: PropTypes.func,
}

GleetchyUI.defaultProps = {
  delay: {},
  reverb: {},
  loopers: [],
  isPlaying: false,
  togglePlayback: () => {},
  loadLooperAudio: () => {},
  updateLooper: () => {},
  updateDelay: () => {},
  updateReverb: () => {},
}

export default connect(
  ({ gleetchy }) => ({
    loopers: gleetchy.loopers,
    isPlaying: gleetchy.isPlaying,
    delay: gleetchy.delay,
    reverb: gleetchy.reverb,
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
    loadLooperAudio: id => dispatch(looperLoadFile(id)),
    updateLooper: (id, props) => dispatch(looperUpdateProps(id, props)),
    updateDelay: props => dispatch(delayUpdateProps(props)),
    updateReverb: props => dispatch(reverbUpdateProps(props)),
  }),
)(GleetchyUI)
