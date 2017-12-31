import React from 'react'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import Knob from '~/components/Knob'

const classes = cssLabeled('playbackControls', {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const PlaybackControls = ({
  gain,
  playbackRate,
  onGainChange,
  onPlaybackRateChange,
}) => (
  <div className={classes.root}>
    <div>
      <Knob
        value={gain}
        renderTitle={() => 'Gain'}
        renderLabel={() => 'G'}
        renderValue={() => gain.toFixed(2)}
        onChange={onGainChange}
      />
    </div>
    <div>
      <Knob
        value={playbackRate * 0.5}
        renderTitle={() => 'Speed'}
        renderLabel={() => 'S'}
        renderValue={() => playbackRate.toFixed(2)}
        onChange={val => onPlaybackRateChange(val * 2)}
      />
    </div>
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
