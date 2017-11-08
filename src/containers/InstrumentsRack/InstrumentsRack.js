import React from 'react'
import PropTypes from '~/PropTypes'
import { noop, stubArray } from '~/util/function'
import ErrorBoundary from '~/components/ErrorBoundary'
import AnimIn from '~/components/AnimIn'
import { UI as Loop, nodeType as loopType } from '~/nodes/instruments/loop'

const InstrumentsRack = ({
  instruments,
  activeInstruments,
  loopSelectFile,
  loopReceiveFile,
  updateInstrument,
  updateInstrumentLabel,
  addLoop,
  removeInstrument,
  getConnections,
}) => (
  <div className="instrumentsRack">
    <ErrorBoundary>
      {instruments.map(({ id, type, label, props }) => {
        switch (type) {
          case loopType:
            return (
              <div className="instrumentsRack__instrumentContainer" key={id}>
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
                    onGainChange={val => updateInstrument(id, { gain: val })}
                    onPlaybackRateChange={val =>
                      updateInstrument(id, { playbackRate: val })
                    }
                    onLoopRegionChange={(start, end) =>
                      updateInstrument(id, {
                        loopStart: start,
                        loopEnd: end,
                      })
                    }
                    onEqChange={eqProps => updateInstrument(id, eqProps)}
                  />
                </AnimIn>
              </div>
            )

          default:
            return null
        }
      })}
    </ErrorBoundary>
    <div
      className="instrumentsRack__addButton"
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
      .instrumentsRack {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .instrumentsRack__instrumentContainer:not(:first-child) {
        margin-top: 2em;
      }

      .instrumentsRack__addButton {
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

InstrumentsRack.propTypes = {
  instruments: PropTypes.arrayOf(PropTypes.shape({})),
  activeInstruments: PropTypes.arrayOf(PropTypes.string),
  getConnections: PropTypes.func,
  loopSelectFile: PropTypes.func,
  loopReceiveFile: PropTypes.func,
  updateInstrument: PropTypes.func,
  updateInstrumentLabel: PropTypes.func,
  addLoop: PropTypes.func,
  removeInstrument: PropTypes.func,
}

InstrumentsRack.defaultProps = {
  instruments: [],
  activeInstruments: [],
  getConnections: stubArray,
  loopSelectFile: noop,
  loopReceiveFile: noop,
  updateInstrument: noop,
  updateInstrumentLabel: noop,
  addLoop: noop,
  removeInstrument: noop,
}

export default InstrumentsRack
