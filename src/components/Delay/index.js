import React from 'react'
import PropTypes from 'prop-types'
import Knob from '../Knob'
import TitleBar from '../TitleBar'

const Delay = ({
  wetDryRatio,
  delayTime,
  onWetDryRatioChange,
  onDelayTimeChange,
}) => (
  <div className="root">
    <TitleBar>{() => 'Delay'}</TitleBar>
    <div className="knobs">
      <div className="knobContainer">
        <Knob
          radius="2.4em"
          value={delayTime}
          onChange={onDelayTimeChange}
          renderLabel={() => 'T'}
          renderTitle={() => 'Delay time'}
          renderValue={() => delayTime.toFixed(2)}
        />
      </div>
      <div className="knobContainer">
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
      .root {
        width: 100%;
      }

      .knobs {
        width: 100%;
        display: flex;
      }

      .knobContainer {
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
