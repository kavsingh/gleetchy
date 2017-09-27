import React from 'react'
import PropTypes from 'prop-types'
import Knob from '../Knob'

const Delay = ({ dryWet, delayTime, onDryWetChange, onDelayTimeChange }) => (
  <div className="root">
    <div className="knobContainer">
      <Knob
        value={dryWet}
        onChange={onDryWetChange}
        renderLabel={() => 'W / D'}
        renderTitle={() => 'Wet / Dry ratio'}
        renderValue={() => `${(dryWet * 100).toFixed(1)}%`}
      />
    </div>
    <div className="knobContainer">
      <Knob
        value={delayTime}
        onChange={onDelayTimeChange}
        renderLabel={() => 'T'}
        renderTitle={() => 'Delay time'}
        renderValue={() => delayTime.toFixed(2)}
      />
    </div>
    <style jsx>{`
      .root {
        width: 100%;
        display: flex;
      }

      .knobContainer {
        flex: 0 0 2.4em;
        width: 2.4em;
        height: 2.4em;
      }
    `}</style>
  </div>
)

Delay.propTypes = {
  dryWet: PropTypes.number,
  delayTime: PropTypes.number,
  onDelayTimeChange: PropTypes.func,
  onDryWetChange: PropTypes.func,
}

Delay.defaultProps = {
  dryWet: 0.5,
  delayTime: 1,
  onDelayTimeChange: () => {},
  onDryWetChange: () => {},
}

export default Delay
