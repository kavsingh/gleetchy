import React, { memo, FunctionComponent } from 'react'
import { cx, css } from 'emotion'
import { always } from 'ramda'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'

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

const renderWetDryLabel = always('W / D')
const renderWetDryTitle = always('Wet / Dry Ratio')

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
  <div className={cx([rootStyle, !isActive && inactiveStyle])}>
    <TitleBar
      type="Reverb"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
    <div className={controlsStyle}>
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

export default memo(Reverb)
