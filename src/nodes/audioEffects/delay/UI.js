import React from 'react'
import PropTypes from '~/PropTypes'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { noop } from '~/util/function'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'

const Delay = ({
  label,
  wetDryRatio,
  delayTime,
  onWetDryRatioChange,
  onDelayTimeChange,
  isActive,
  onLabelChange,
  remove,
  connections,
}) => (
  <div className={`delay${!isActive ? ' delay_inactive' : ''}`}>
    <TitleBar
      type="Delay"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
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
        opacity: 1;
        transition: opacity 0.2s ease-out;
      }

      .delay_inactive {
        opacity: 0.4;
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
  label: PropTypes.string,
  connections: PropTypes.arrayOf(PropTypes.connection),
  wetDryRatio: PropTypes.number,
  delayTime: PropTypes.number,
  isActive: PropTypes.bool,
  onDelayTimeChange: PropTypes.func,
  onWetDryRatioChange: PropTypes.func,
  onLabelChange: PropTypes.func,
  remove: PropTypes.func,
}

Delay.defaultProps = {
  label: 'Delay',
  connections: [],
  wetDryRatio: 0.5,
  delayTime: 1,
  isActive: true,
  onDelayTimeChange: noop,
  onWetDryRatioChange: noop,
  onLabelChange: noop,
  remove: noop,
}

export default Delay
