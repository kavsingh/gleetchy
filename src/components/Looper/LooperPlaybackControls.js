import React from 'react'
import Knob from '../Knob'
import PropTypes from 'prop-types'

const LooperPlaybackControls = ({
  gain,
  playbackRate,
  onGainChange,
  onPlaybackRateChange,
}) => (
  <div className="looper__playbackControls">
    <div className="looper__playbackControlContainer">
      <Knob
        value={gain}
        renderTitle={() => 'Gain'}
        renderLabel={() => 'G'}
        renderValue={() => gain.toFixed(2)}
        onChange={onGainChange}
      />
    </div>
    <div className="looper__playbackControlContainer">
      <Knob
        value={playbackRate * 0.5}
        renderTitle={() => 'Speed'}
        renderLabel={() => 'S'}
        renderValue={() => playbackRate.toFixed(2)}
        onChange={val => onPlaybackRateChange(val * 2)}
      />
    </div>
    <style jsx>{`
      .looper__playbackControls {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  </div>
)

LooperPlaybackControls.propTypes = {
  gain: PropTypes.number,
  playbackRate: PropTypes.number,
  onGainChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
}

LooperPlaybackControls.defaultProps = {
  gain: 1,
  playbackRate: 1,
  onGainChange: () => {},
  onPlaybackRateChange: () => {},
}

export default LooperPlaybackControls
