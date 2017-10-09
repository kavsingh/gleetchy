import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, head } from 'ramda'
import GithubIcon from 'react-icons/lib/go/mark-github'
import {
  looperUpdateProps,
  looperSelectAudioFile,
  looperReceiveAudioFile,
  playbackToggle,
  delayUpdateProps,
  reverbUpdateProps,
  connectionToggle,
} from '../../state/gleetchy/actions'
import {
  loopersSelector,
  delaySelector,
  reverbSelector,
  isPlayingSelector,
  connectionsSelector,
  activeFXSelector,
} from '../../state/gleetchy/selectors'
import PlayPauseButton from '../../components/PlayPauseButton'
import Looper from '../../components/Looper'
import LooperPlaybackControls from '../../components/Looper/LooperPlaybackControls'
import LooperEqControls from '../../components/Looper/LooperEqControls'
import Delay from '../../components/Delay'
import Reverb from '../../components/Reverb'
import ErrorBoundary from '../../components/ErrorBoundary'
import PatchBay from '../../components/PatchBay'

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
  style: PropTypes.shape({}),
}

Panel.defaultProps = {
  children: [],
  style: {},
}

const checkActiveNode = (from, to, connections) => {
  const [fromId, toId] = [from, to].map(({ id }) => id)

  return !!connections.find(equals([fromId, toId]))
}

const GleetchyUI = ({
  loopers,
  delay,
  reverb,
  isPlaying,
  activeFx,
  connections,
  togglePlayback,
  looperSelectFile,
  looperReceiveFile,
  updateLooper,
  updateDelay,
  updateReverb,
  toggleConnection,
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
            <Looper
              gain={gain}
              playbackRate={playbackRate}
              loopStart={loopStart}
              loopEnd={loopEnd}
              label={label}
              fileName={fileName}
              fileType={fileType}
              audioBuffer={audioBuffer}
              selectAudioFile={() => looperSelectFile(id)}
              receiveAudioFile={file => looperReceiveFile(id, file)}
              onLoopRegionChange={(start, end) =>
                updateLooper(id, {
                  loopStart: start,
                  loopEnd: end,
                })}
              renderControls={() => [
                <LooperPlaybackControls
                  key="playback"
                  gain={gain}
                  playbackRate={playbackRate}
                  onGainChange={val => updateLooper(id, { gain: val })}
                  onPlaybackRateChange={val =>
                    updateLooper(id, { playbackRate: val })}
                />,
                <LooperEqControls
                  key="eq"
                  eqLow={eqLow}
                  eqMid={eqMid}
                  eqHigh={eqHigh}
                  onEqChange={props => updateLooper(id, props)}
                />,
              ]}
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
      <ErrorBoundary silent>
        <Panel style={{ flexGrow: 1, flexShrink: 0 }}>
          <Delay
            isActive={activeFx.includes('delay')}
            wetDryRatio={delay.wetDryRatio}
            delayTime={delay.delayTime}
            onDelayTimeChange={delayTime => updateDelay({ delayTime })}
            onWetDryRatioChange={wetDryRatio => updateDelay({ wetDryRatio })}
          />
          <Reverb
            isActive={activeFx.includes('reverb')}
            wetDryRatio={reverb.wetDryRatio}
            onWetDryRatioChange={wetDryRatio => updateReverb({ wetDryRatio })}
          />
        </Panel>
        <Panel style={{ flexGrow: 0, flexShrink: 0 }}>
          <PatchBay
            fromNodes={[
              ...loopers.map(({ id, label }) => ({
                id,
                label: label
                  .split(' ')
                  .map(head)
                  .join(''),
                title: `${label} out`,
              })),
              { id: 'delay', label: 'D', title: 'Delay out' },
              { id: 'reverb', label: 'R', title: 'Reverb out' },
            ]}
            toNodes={[
              { id: 'reverb', label: 'R', title: 'Reverb in' },
              { id: 'delay', label: 'D', title: 'Delay in' },
              { id: 'mainOut', label: 'M', title: 'Main out' },
            ]}
            onNodeClick={(from, to) => toggleConnection(from.id, to.id)}
            checkActiveNode={(from, to) =>
              checkActiveNode(from, to, connections)}
          />
        </Panel>
      </ErrorBoundary>
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
  delay: PropTypes.shape({}),
  reverb: PropTypes.shape({}),
  loopers: PropTypes.arrayOf(PropTypes.shape({})),
  isPlaying: PropTypes.bool,
  connections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  activeFx: PropTypes.arrayOf(PropTypes.string),
  togglePlayback: PropTypes.func,
  looperSelectFile: PropTypes.func,
  looperReceiveFile: PropTypes.func,
  updateLooper: PropTypes.func,
  updateDelay: PropTypes.func,
  updateReverb: PropTypes.func,
  toggleConnection: PropTypes.func,
}

GleetchyUI.defaultProps = {
  delay: {},
  reverb: {},
  loopers: [],
  isPlaying: false,
  connections: [],
  activeFx: [],
  togglePlayback: () => {},
  looperSelectFile: () => {},
  looperReceiveFile: () => {},
  updateLooper: () => {},
  updateDelay: () => {},
  updateReverb: () => {},
  toggleConnection: () => {},
}

export default connect(
  state => ({
    loopers: loopersSelector(state),
    isPlaying: isPlayingSelector(state),
    delay: delaySelector(state),
    reverb: reverbSelector(state),
    connections: connectionsSelector(state),
    activeFx: activeFXSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(playbackToggle()),
    looperSelectFile: id => dispatch(looperSelectAudioFile(id)),
    looperReceiveFile: (id, file) => dispatch(looperReceiveAudioFile(id, file)),
    updateLooper: (id, props) => dispatch(looperUpdateProps(id, props)),
    updateDelay: props => dispatch(delayUpdateProps(props)),
    updateReverb: props => dispatch(reverbUpdateProps(props)),
    toggleConnection: (fromId, toId) =>
      dispatch(connectionToggle(fromId, toId)),
  }),
)(GleetchyUI)
