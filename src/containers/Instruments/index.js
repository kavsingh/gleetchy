import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { INS_LOOPER } from '../../constants/nodeTypes'
import { instrumentsSelector } from '../../state/gleetchy/selectors'
import {
  nodeUpdateProps,
  looperReceiveAudioFile,
  looperSelectAudioFile,
  looperAdd,
} from '../../state/gleetchy/actions'
import ErrorBoundary from '../../components/ErrorBoundary'
import Looper from '../../components/Looper'
import LooperEqControls from '../../components/Looper/LooperEqControls'
import LooperPlaybackControls from '../../components/Looper/LooperPlaybackControls'

const Instruments = ({
  instruments,
  looperSelectFile,
  looperReceiveFile,
  updateInstrument,
  addLooper,
}) => (
  <div className="instruments">
    {instruments.map(({ id, label, type, props }, index) => (
      <div
        className={`instruments__instrumentContainer${index === 0
          ? ' instruments__instrumentContainer_first'
          : ''}`}
        key={id}
      >
        <ErrorBoundary>
          {type === INS_LOOPER ? (
            <Looper
              {...props}
              label={label}
              selectAudioFile={() => looperSelectFile(id)}
              receiveAudioFile={file => looperReceiveFile(id, file)}
              onLoopRegionChange={(start, end) =>
                updateInstrument(id, {
                  loopStart: start,
                  loopEnd: end,
                })}
              renderControls={() => [
                <LooperPlaybackControls
                  key="playback"
                  gain={props.gain}
                  playbackRate={props.playbackRate}
                  onGainChange={val => updateInstrument(id, { gain: val })}
                  onPlaybackRateChange={val =>
                    updateInstrument(id, { playbackRate: val })}
                />,
                <LooperEqControls
                  key="eq"
                  eqLow={props.eqLow}
                  eqMid={props.eqMid}
                  eqHigh={props.eqHigh}
                  onEqChange={eqProps => updateInstrument(id, eqProps)}
                />,
              ]}
            />
          ) : null}
        </ErrorBoundary>
      </div>
    ))}
    <div
      className="instruments__addButton"
      onClick={addLooper}
      role="button"
      tabIndex={0}
      onKeyDown={addLooper}
    >
      +
    </div>
    <style jsx>{`
      .instruments {
        width: 100%;
      }

      .instruments__instrumentContainer {
        height: 12em;
        margin-top: 2em;
      }

      .instruments__instrumentContainer_first {
        margin-top: 0;
      }

      .instruments__addbutton {
        cursor: pointer;
      }
    `}</style>
  </div>
)

Instruments.propTypes = {
  instruments: PropTypes.arrayOf(PropTypes.shape({})),
  looperSelectFile: PropTypes.func,
  looperReceiveFile: PropTypes.func,
  updateInstrument: PropTypes.func,
  addLooper: PropTypes.func,
}

Instruments.defaultProps = {
  instruments: [],
  looperSelectFile: () => {},
  looperReceiveFile: () => {},
  updateInstrument: () => {},
  addLooper: () => {},
}

export default connect(
  state => ({
    instruments: instrumentsSelector(state),
  }),
  dispatch => ({
    looperSelectFile: id => dispatch(looperSelectAudioFile(id)),
    looperReceiveFile: (id, file) => dispatch(looperReceiveAudioFile(id, file)),
    updateInstrument: (id, props) => dispatch(nodeUpdateProps(id, props)),
    addLooper: () => dispatch(looperAdd()),
  }),
)(Instruments)
