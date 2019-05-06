import React, { memo, FunctionComponent } from 'react'
import { cx, css } from 'emotion'
import { always } from 'ramda'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'
import { DELAY_UPPER_BOUND } from '~/constants/audio'

const rootStyle = css({
  opacity: 1,
  transition: 'opacity 0.2s ease-out',
  width: '100%',
})

const inactiveStyle = css({
  opacity: 0.4,
})

const controlsStyle = css({
  display: 'flex',
  width: '100%',
})

const knobContainerStyle = css({
  flex: '0 0 3em',
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

const renderTimeLabel = always('T')
const renderTimeTitle = always('Delay Time')
const renderWetDryLabel = always('W / D')
const renderWetDryTitle = always('Wet / Dry Ratio')

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
  <div className={cx([rootStyle, !isActive && inactiveStyle])}>
    <TitleBar
      type="Delay"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
    <div className={controlsStyle}>
      <div className={knobContainerStyle}>
        <Knob
          radius="2.4em"
          value={delayTime / DELAY_UPPER_BOUND}
          onChange={val => onDelayTimeChange(val * DELAY_UPPER_BOUND)}
          renderLabel={renderTimeLabel}
          renderTitle={renderTimeTitle}
          renderValue={() => delayTime.toFixed(2)}
        />
      </div>
      <div className={knobContainerStyle}>
        <Knob
          radius="2.4em"
          value={wetDryRatio}
          onChange={onWetDryRatioChange}
          renderLabel={renderWetDryLabel}
          renderTitle={renderWetDryTitle}
          renderValue={() => `${(wetDryRatio * 100).toFixed(1)}%`}
        />
      </div>
    </div>
  </div>
)

export default memo(Delay)
