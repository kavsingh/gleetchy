import { cx } from 'emotion'
import React, { memo, FunctionComponent } from 'react'

import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('delay', {
  root: {
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    width: '100%',
  },

  inactive: {
    opacity: 0.4,
  },

  controls: {
    display: 'flex',
    width: '100%',
  },

  knobContainer: {
    flex: '0 0 3em',
  },
})

export interface DelayProps {
  label: string
  connections: AudioNodeConnection[]
  wetDryRatio: number
  delayTime: number
  isActive: boolean
  onDelayTimeChange(delayTime: number): unknown
  onWetDryRatioChange(wetDryRatio: number): unknown
  onLabelChange(label: string): unknown
  remove(): unknown
}

const Delay: FunctionComponent<DelayProps> = ({
  label = 'Delay',
  connections = [],
  wetDryRatio = 0.5,
  delayTime = 1,
  isActive = true,
  onDelayTimeChange = noop,
  onWetDryRatioChange = noop,
  onLabelChange = noop,
  remove = noop,
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

export default memo(Delay)
