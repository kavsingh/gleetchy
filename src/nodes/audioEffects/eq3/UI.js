import React from 'react'
import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import Slider from '~/components/Slider'

const Eq3 = ({ lowGain, midGain, highGain, onChange }) => (
  <div className="eq3">
    <div className="eq3__sliderContainer">
      <Slider
        value={lowGain * 0.5 + 0.5}
        renderTitle={() => 'EQ low gain'}
        renderLabel={() => 'L'}
        renderValue={() => lowGain.toFixed(1)}
        onChange={val => onChange({ lowGain: val * 2 - 1 })}
      />
    </div>
    <div className="eq3__sliderContainer">
      <Slider
        value={midGain * 0.5 + 0.5}
        renderTitle={() => 'EQ mid gain'}
        renderLabel={() => 'M'}
        renderValue={() => midGain.toFixed(1)}
        onChange={val => onChange({ midGain: val * 2 - 1 })}
      />
    </div>
    <div className="eq3__sliderContainer">
      <Slider
        value={highGain * 0.5 + 0.5}
        renderTitle={() => 'EQ high gain'}
        renderLabel={() => 'H'}
        renderValue={() => highGain.toFixed(1)}
        onChange={val => onChange({ highGain: val * 2 - 1 })}
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
  lowGain: PropTypes.number,
  midGain: PropTypes.number,
  highGain: PropTypes.number,
  onChange: PropTypes.func,
}

Eq3.defaultProps = {
  lowGain: 0,
  midGain: 0,
  highGain: 0,
  onChange: noop,
}

export default Eq3