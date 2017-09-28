import React from 'react'
import PropTypes from 'prop-types'
import Knob from '../Knob'
import TitleBar from '../TitleBar'

const Reverb = ({ wetDryRatio, onWetDryRatioChange }) => (
  <div className="reverb">
    <TitleBar>{() => 'Reverb'}</TitleBar>
    <div className="reverb__controls">
      <div className="reverb__knobContainer">
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

      .reverb__controls {
        width: 100%;
        display: flex;
      }

      .reverb__knobContainer {
        flex: 0 0 3em;
      }
    `}</style>
  </div>
)

Reverb.propTypes = {
  wetDryRatio: PropTypes.number,
  onWetDryRatioChange: PropTypes.func,
}

Reverb.defaultProps = {
  wetDryRatio: 0.5,
  onWetDryRatioChange: () => {},
}

export default Reverb
