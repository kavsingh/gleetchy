import React from 'react'
import PropTypes from 'prop-types'
import { DELAY_UPPER_BOUND } from '../../constants/audio'
import Knob from '../Knob'
import Slider from '../Slider'
import TitleBar from '../TitleBar'

const Delay = ({
  wetDryRatio,
  delayTime,
  onWetDryRatioChange,
  onDelayTimeChange,
}) => (
  <div className="delay">
    <TitleBar>{() => 'Delay'}</TitleBar>
    <div className="delay__controls">
      <div className="delay__knobContainer">
        <Knob
          radius="2.4em"
          value={delayTime / DELAY_UPPER_BOUND}
          onChange={val => onDelayTimeChange(val * DELAY_UPPER_BOUND)}
          renderLabel={() => 'T'}
          renderTitle={() => 'Delay time'}
          renderValue={() => delayTime.toFixed(2)}
        />
      </div>
      <div className="delay__knobContainer">
        <Knob
          radius="2.4em"
          value={wetDryRatio}
          onChange={onWetDryRatioChange}
          renderLabel={() => 'W / D'}
          renderTitle={() => 'Wet / Dry ratio'}
          renderValue={() => `${(wetDryRatio * 100).toFixed(1)}%`}
        />
      </div>
    </div>
    <style jsx>{`
      .delay {
        width: 100%;
      }

      .delay__controls {
        width: 100%;
        display: flex;
      }

      .delay__knobContainer {
        flex: 0 0 3em;
      }
    `}</style>
  </div>
)

Delay.propTypes = {
  wetDryRatio: PropTypes.number,
  delayTime: PropTypes.number,
  onDelayTimeChange: PropTypes.func,
  onWetDryRatioChange: PropTypes.func,
}

Delay.defaultProps = {
  wetDryRatio: 0.5,
  delayTime: 1,
  onDelayTimeChange: () => {},
  onWetDryRatioChange: () => {},
}

export default Delay
