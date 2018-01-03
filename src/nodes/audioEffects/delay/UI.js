import React from 'react'
import { cx } from 'emotion'

import PropTypes from '~/PropTypes'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'

const classes = cssLabeled('delay', {
  root: {
    width: '100%',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
  },

  inactive: {
    opacity: 0.4,
  },

  controls: {
    width: '100%',
    display: 'flex',
  },

  knobContainer: {
    flex: '0 0 3em',
  },
})

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
  <div className={cx([classes.root, !isActive && classes.inactive])}>
    <TitleBar
      type="Delay"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
    <div className={classes.controls}>
      <div className={classes.knobContainer}>
        <Knob
          radius="2.4em"
          value={delayTime / DELAY_UPPER_BOUND}
          onChange={val => onDelayTimeChange(val * DELAY_UPPER_BOUND)}
          renderLabel={() => 'T'}
          renderTitle={() => 'Delay time'}
          renderValue={() => delayTime.toFixed(2)}
        />
      </div>
      <div className={classes.knobContainer}>
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
