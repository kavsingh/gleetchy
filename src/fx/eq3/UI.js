import React from 'react'
import PropTypes from '../../PropTypes'
import { noop } from '../../util/function'
import Slider from '../../components/Slider'

const Eq3 = ({ eqLow, eqMid, eqHigh, onChange }) => (
  <div className="eq3">
    <div className="eq3__sliderContainer">
      <Slider
        value={eqLow * 0.5 + 0.5}
        renderTitle={() => 'EQ low gain'}
        renderLabel={() => 'L'}
        renderValue={() => eqLow.toFixed(1)}
        onChange={val => onChange({ eqLow: val * 2 - 1 })}
      />
    </div>
    <div className="eq3__sliderContainer">
      <Slider
        value={eqMid * 0.5 + 0.5}
        renderTitle={() => 'EQ mid gain'}
        renderLabel={() => 'M'}
        renderValue={() => eqMid.toFixed(1)}
        onChange={val => onChange({ eqMid: val * 2 - 1 })}
      />
    </div>
    <div className="eq3__sliderContainer">
      <Slider
        value={eqHigh * 0.5 + 0.5}
        renderTitle={() => 'EQ high gain'}
        renderLabel={() => 'H'}
        renderValue={() => eqHigh.toFixed(1)}
        onChange={val => onChange({ eqHigh: val * 2 - 1 })}
      />
    </div>
    <style jsx>{`
      .eq3 {
        height: 100%;
        margin-left: 0.6em;
        display: flex;
      }

      .eq3__sliderContainer {
        width: 2em;
        height: 100%;
      }
    `}</style>
  </div>
)

Eq3.propTypes = {
  eqLow: PropTypes.number,
  eqMid: PropTypes.number,
  eqHigh: PropTypes.number,
  onChange: PropTypes.func,
}

Eq3.defaultProps = {
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
  onChange: noop,
}

export default Eq3
