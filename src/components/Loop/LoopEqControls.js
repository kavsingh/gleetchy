import React from 'react'
import PropTypes from '../../PropTypes'
import { noop } from '../../util/function'
import Slider from '../Slider'

const LoopEqControls = ({ eqLow, eqMid, eqHigh, onEqChange }) => (
  <div className="loop__eqControls">
    <div className="loop__eqControlContainer">
      <Slider
        value={eqLow * 0.5 + 0.5}
        renderTitle={() => 'EQ low gain'}
        renderLabel={() => 'L'}
        renderValue={() => eqLow.toFixed(1)}
        onChange={val => onEqChange({ eqLow: val * 2 - 1 })}
      />
    </div>
    <div className="loop__eqControlContainer">
      <Slider
        value={eqMid * 0.5 + 0.5}
        renderTitle={() => 'EQ mid gain'}
        renderLabel={() => 'M'}
        renderValue={() => eqMid.toFixed(1)}
        onChange={val => onEqChange({ eqMid: val * 2 - 1 })}
      />
    </div>
    <div className="loop__eqControlContainer">
      <Slider
        value={eqHigh * 0.5 + 0.5}
        renderTitle={() => 'EQ high gain'}
        renderLabel={() => 'H'}
        renderValue={() => eqHigh.toFixed(1)}
        onChange={val => onEqChange({ eqHigh: val * 2 - 1 })}
      />
    </div>
    <style jsx>{`
      .loop__eqControls {
        height: 100%;
        margin-left: 0.6em;
        display: flex;
      }

      .loop__eqControlContainer {
        width: 2em;
        height: 100%;
      }
    `}</style>
  </div>
)

LoopEqControls.propTypes = {
  eqLow: PropTypes.number,
  eqMid: PropTypes.number,
  eqHigh: PropTypes.number,
  onEqChange: PropTypes.func,
}

LoopEqControls.defaultProps = {
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
  onEqChange: noop,
}

export default LoopEqControls
