import React from 'react'
import PropTypes from 'prop-types'
import { onlyUpdateForKeys } from 'recompose'
import color from 'color'
import { COLOR_PAGE } from '../../constants/style'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'

const LoopSample = ({
  fromSaved,
  audioBuffer,
  loopStart,
  loopEnd,
  onLoopStartDrag,
  onLoopEndDrag,
  onLoopRegionDrag,
  selectAudioFile,
}) => (
  <div className="loop__sample">
    <div className="loop__waveFormContainer">
      <WaveForm buffer={audioBuffer} />
    </div>
    {audioBuffer ? (
      <div className="loop__loopRegionContainer">
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
        className="loop__initLoadButon"
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
      .loop__sample {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .loop__waveFormContainer,
      .loop__loopRegionContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .loop__waveFormContainer {
        z-index: 1;
      }

      .loop__loopRegionContainer {
        z-index: 2;
      }

      .loop__initLoadButon {
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
        background-color: ${color(COLOR_PAGE)
          .alpha(0.96)
          .string()};
        padding: 3em;
      }

      .loop__initLoadButon span {
        display: block;
        text-align: center;
      }
    `}</style>
  </div>
)

LoopSample.propTypes = {
  fromSaved: PropTypes.bool,
  audioBuffer: PropTypes.instanceOf(AudioBuffer),
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  onLoopStartDrag: PropTypes.func,
  onLoopEndDrag: PropTypes.func,
  onLoopRegionDrag: PropTypes.func,
  selectAudioFile: PropTypes.func,
}

LoopSample.defaultProps = {
  fromSaved: false,
  audioBuffer: undefined,
  loopStart: 0,
  loopEnd: 1,
  onLoopStartDrag: () => {},
  onLoopEndDrag: () => {},
  onLoopRegionDrag: () => {},
  selectAudioFile: () => {},
}

export default onlyUpdateForKeys([
  'fromSaved',
  'audioBuffer',
  'loopStart',
  'loopEnd',
])(LoopSample)
