import React, { memo, FunctionComponent } from 'react'
import { css } from 'emotion'
import { always } from 'ramda'

import { noop } from '~/util/function'
import Slider from '~/components/Slider'

const rootStyle = css({
  display: 'flex',
  height: '100%',
  marginLeft: '0.6em',
})

const sliderContainerStyle = css({
  height: '100%',
  width: '2em',
})

export interface Eq3Props {
  lowGain: number
  midGain: number
  highGain: number
  onChange(eqProps: { [key: string]: number }): unknown
}

const renderLowGainTitle = always('EQ Low Gain')
const renderLowGainLabel = always('L')
const renderMidGainTitle = always('EQ Mid Gain')
const renderMidGainLabel = always('M')
const renderHighGainTitle = always('EQ High Gain')
const renderHighGainLabel = always('H')

const Eq3: FunctionComponent<Eq3Props> = ({
  lowGain = 0,
  midGain = 0,
  highGain = 0,
  onChange = noop,
}) => (
  <div className={rootStyle}>
    <div className={sliderContainerStyle}>
      <Slider
        value={lowGain * 0.5 + 0.5}
        renderTitle={renderLowGainTitle}
        renderLabel={renderLowGainLabel}
        renderValue={() => lowGain.toFixed(1)}
        onChange={val => onChange({ lowGain: val * 2 - 1 })}
      />
    </div>
    <div className={sliderContainerStyle}>
      <Slider
        value={midGain * 0.5 + 0.5}
        renderTitle={renderMidGainTitle}
        renderLabel={renderMidGainLabel}
        renderValue={() => midGain.toFixed(1)}
        onChange={val => onChange({ midGain: val * 2 - 1 })}
      />
    </div>
    <div className={sliderContainerStyle}>
      <Slider
        value={highGain * 0.5 + 0.5}
        renderTitle={renderHighGainTitle}
        renderLabel={renderHighGainLabel}
        renderValue={() => highGain.toFixed(1)}
        onChange={val => onChange({ highGain: val * 2 - 1 })}
      />
    </div>
  </div>
)

export default memo(Eq3)
