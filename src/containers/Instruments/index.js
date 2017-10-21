import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { __ } from 'ramda'
import { getConnectionsFor } from '../../util/audio'
import { noop, stubArray } from '../../util/function'
import {
  loopsSelector,
  activeInstrumentsSelector,
} from '../../state/instruments/selectors'
import { connectionsSelector } from '../../state/connections/selectors'
import {
  selectAudioFileAction,
  receiveAudioFileAction,
} from '../../state/audioFiles/actions'
import {
  addLoopAction,
  removeInstrumentAction,
  updateInstrumentLabelAction,
  updateInstrumentPropsAction,
} from '../../state/instruments/actions'
import ErrorBoundary from '../../components/ErrorBoundary'
import AnimIn from '../../components/AnimIn'
import Loop from '../../components/Loop'
import LoopEqControls from '../../components/Loop/LoopEqControls'
import LoopPlaybackControls from '../../components/Loop/LoopPlaybackControls'

const Instruments = ({
  loops,
  activeInstruments,
  loopSelectFile,
  loopReceiveFile,
  updateInstrument,
  updateInstrumentLabel,
  addLoop,
  removeInstrument,
  getConnections,
}) => (
  <div className="instruments">
    <ErrorBoundary>
      {loops.map(({ id, label, props }) => (
        <div className="instruments__instrumentContainer" key={id}>
          <AnimIn>
            <Loop
              {...props}
              label={label}
              isActive={activeInstruments.includes(id)}
              selectAudioFile={() => loopSelectFile(id)}
              receiveAudioFile={file => loopReceiveFile(id, file)}
              remove={() => removeInstrument(id)}
              onLabelChange={val => updateInstrumentLabel(id, val)}
              connections={getConnections(id)}
              onLoopRegionChange={(start, end) =>
                updateInstrument(id, {
                  loopStart: start,
                  loopEnd: end,
                })}
              renderControls={() => [
                <LoopPlaybackControls
                  key="playback"
                  gain={props.gain}
                  playbackRate={props.playbackRate}
                  onGainChange={val => updateInstrument(id, { gain: val })}
                  onPlaybackRateChange={val =>
                    updateInstrument(id, { playbackRate: val })}
                />,
                <LoopEqControls
                  key="eq"
                  eqLow={props.eqLow}
                  eqMid={props.eqMid}
                  eqHigh={props.eqHigh}
                  onEqChange={eqProps => updateInstrument(id, eqProps)}
                />,
              ]}
            />
          </AnimIn>
        </div>
      ))}
    </ErrorBoundary>
    <div
      className="instruments__addButton"
      onClick={addLoop}
      role="button"
      tabIndex={0}
      onKeyDown={({ key }) => {
        if (key === 'Enter') addLoop()
      }}
    >
      [ Add loop ]
    </div>
    <style jsx>{`
      .instruments {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .instruments__instrumentContainer:not(:first-child) {
        margin-top: 2em;
      }

      .instruments__addButton {
        cursor: pointer;
        margin: 2em 0 0;
        padding: 1em 0;
        width: 100%;
        text-align: center;
        font-size: 0.8em;
      }
    `}</style>
  </div>
)

Instruments.propTypes = {
  loops: PropTypes.arrayOf(PropTypes.shape({})),
  activeInstruments: PropTypes.arrayOf(PropTypes.string),
  getConnections: PropTypes.func,
  loopSelectFile: PropTypes.func,
  loopReceiveFile: PropTypes.func,
  updateInstrument: PropTypes.func,
  updateInstrumentLabel: PropTypes.func,
  addLoop: PropTypes.func,
  removeInstrument: PropTypes.func,
}

Instruments.defaultProps = {
  loops: [],
  activeInstruments: [],
  getConnections: stubArray,
  loopSelectFile: noop,
  loopReceiveFile: noop,
  updateInstrument: noop,
  updateInstrumentLabel: noop,
  addLoop: noop,
  removeInstrument: noop,
}

export default connect(
  state => ({
    loops: loopsSelector(state),
    activeInstruments: activeInstrumentsSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    loopSelectFile: id => dispatch(selectAudioFileAction(id)),
    loopReceiveFile: (id, file) => dispatch(receiveAudioFileAction(id, file)),
    updateInstrument: (id, props) =>
      dispatch(updateInstrumentPropsAction(id, props)),
    updateInstrumentLabel: (id, label) =>
      dispatch(updateInstrumentLabelAction(id, label)),
    addLoop: () => dispatch(addLoopAction()),
    removeInstrument: id => dispatch(removeInstrumentAction(id)),
  }),
)(Instruments)
