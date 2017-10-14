import React from 'react'
import PropTypes from 'prop-types'
import Knob from '../Knob'
import TitleBar from '../TitleBar'

const Reverb = ({ label, wetDryRatio, onWetDryRatioChange, isActive }) => (
  <div className={`reverb${!isActive ? ' reverb_inactive' : ''}`}>
    <TitleBar>{() => label}</TitleBar>
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
      .reverb {
        width: 100%;
        opacity: 1;
        transition: opacity 0.2s ease-out;
      }

      .reverb_inactive {
        opacity: 0.4;
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
  label: PropTypes.string,
  wetDryRatio: PropTypes.number,
  isActive: PropTypes.bool,
  onWetDryRatioChange: PropTypes.func,
}

Reverb.defaultProps = {
  label: 'Reverb',
  wetDryRatio: 0.5,
  isActive: true,
  onWetDryRatioChange: () => {},
}

export default Reverb
