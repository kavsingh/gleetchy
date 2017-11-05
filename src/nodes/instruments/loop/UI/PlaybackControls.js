import React from 'react'
import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import Knob from '~/components/Knob'

const PlaybackControls = ({
  gain,
  playbackRate,
  onGainChange,
  onPlaybackRateChange,
}) => (
  <div className="playbackControls">
    <div className="playbackControls__controlContainer">
      <Knob
        value={gain}
        renderTitle={() => 'Gain'}
        renderLabel={() => 'G'}
        renderValue={() => gain.toFixed(2)}
        onChange={onGainChange}
      />
    </div>
    <div className="playbackControls__controlContainer">
      <Knob
        value={playbackRate * 0.5}
        renderTitle={() => 'Speed'}
        renderLabel={() => 'S'}
        renderValue={() => playbackRate.toFixed(2)}
        onChange={val => onPlaybackRateChange(val * 2)}
      />
    </div>
    <style jsx>{`
      .playbackControls {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  </div>
)

PlaybackControls.propTypes = {
  gain: PropTypes.number,
  playbackRate: PropTypes.number,
  onGainChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
}

PlaybackControls.defaultProps = {
  gain: 1,
  playbackRate: 1,
  onGainChange: noop,
  onPlaybackRateChange: noop,
}

export default PlaybackControls
