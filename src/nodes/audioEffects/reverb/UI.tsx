import { cx } from 'emotion'
import React, { memo, FunctionComponent } from 'react'

import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'
import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('reverb', {
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

export interface ReverbProps {
  label: string
  wetDryRatio: number
  isActive: boolean
  connections: AudioNodeConnection[]
  onWetDryRatioChange(wetDryRatio: number): unknown
  onLabelChange(label: string): unknown
  remove(): unknown
}

const Reverb: FunctionComponent<ReverbProps> = ({
  label = 'Reverb',
  wetDryRatio = 0.5,
  isActive = true,
  connections = [],
  onWetDryRatioChange = noop,
  onLabelChange = noop,
  remove = noop,
}) => (
  <div className={cx([classes.root, !isActive && classes.inactive])}>
    <TitleBar
      type="Reverb"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
    <div className={classes.controls}>
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

export default memo(Reverb)
