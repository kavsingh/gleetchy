import React from 'react'
import PropTypes from 'prop-types'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'

const LooperSample = ({
  fromSaved,
  audioBuffer,
  loopStart,
  loopEnd,
  onLoopStartDrag,
  onLoopEndDrag,
  onLoopRegionDrag,
  selectAudioFile,
}) => (
  <div className="looper__sample">
    <div className="looper__waveFormContainer">
      <WaveForm buffer={audioBuffer} />
    </div>
    {audioBuffer ? (
      <div className="looper__loopRegionContainer">
        <LoopRegion
          loopStart={loopStart}
          loopEnd={loopEnd}
          onLoopStartDrag={onLoopStartDrag}
          onLoopEndDrag={onLoopEndDrag}
          onLoopRegionDrag={onLoopRegionDrag}
        />
      </div>
    ) : (
      <div
        role="button"
        tabIndex={0}
        onClick={selectAudioFile}
        className="looper__initLoadButon"
        onKeyDown={({ key }) => {
          if (key === 'Enter') selectAudioFile()
        }}
      >
        {fromSaved
          ? [
              <span key="line1">
                Unfortunately audio data is not saved with a project
              </span>,
              <span key="line2">
                Click here (or drag and drop) to load files again
              </span>,
            ]
          : 'Click to load audio file or drag it here'}
      </div>
    )}
    <style jsx>{`
      .looper__sample {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .looper__waveFormContainer,
      .looper__loopRegionContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .looper__waveFormContainer {
        z-index: 1;
      }

      .looper__loopRegionContainer {
        z-index: 2;
      }

      .looper__initLoadButon {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
        z-index: 3;
        background-color: rgba(255, 255, 255, 0.96);
        padding: 3em;
      }

      .looper__initLoadButon span {
        display: block;
        text-align: center;
      }
    `}</style>
  </div>
)

LooperSample.propTypes = {
  fromSaved: PropTypes.bool,
  audioBuffer: PropTypes.instanceOf(AudioBuffer),
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  onLoopStartDrag: PropTypes.func,
  onLoopEndDrag: PropTypes.func,
  onLoopRegionDrag: PropTypes.func,
  selectAudioFile: PropTypes.func,
}

LooperSample.defaultProps = {
  fromSaved: false,
  audioBuffer: undefined,
  loopStart: 0,
  loopEnd: 1,
  onLoopStartDrag: () => {},
  onLoopEndDrag: () => {},
  onLoopRegionDrag: () => {},
  selectAudioFile: () => {},
}

export default LooperSample
