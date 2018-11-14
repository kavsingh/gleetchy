import { always } from 'ramda'
import React from 'react'

import Slider from '~/components/Slider'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('eq3', {
  root: {
    display: 'flex',
    height: '100%',
    marginLeft: '0.6em',
  },

  sliderContainer: {
    height: '100%',
    width: '2em',
  },
})

export interface Eq3Props {
  lowGain: number
  midGain: number
  highGain: number
  onChange(eqProps: { [key: string]: number }): void
}

const defaultOnChange = (_: any) => undefined
const renderLowGainTitle = always('EQ Low Gain')
const renderLowGainLabel = always('L')
const renderMidGainTitle = always('EQ Mid Gain')
const renderMidGainLabel = always('M')
const renderHighGainTitle = always('EQ High Gain')
const renderHighGainLabel = always('H')

const Eq3 = ({
  lowGain = 0,
  midGain = 0,
  highGain = 0,
  onChange = defaultOnChange,
}) => (
  <div className={classes.root}>
    <div className={classes.sliderContainer}>
      <Slider
        value={lowGain * 0.5 + 0.5}
        renderTitle={renderLowGainTitle}
        renderLabel={renderLowGainLabel}
        renderValue={() => lowGain.toFixed(1)}
        onChange={val => onChange({ lowGain: val * 2 - 1 })}
      />
    </div>
    <div className={classes.sliderContainer}>
      <Slider
        value={midGain * 0.5 + 0.5}
        renderTitle={renderMidGainTitle}
        renderLabel={renderMidGainLabel}
        renderValue={() => midGain.toFixed(1)}
        onChange={val => onChange({ midGain: val * 2 - 1 })}
      />
    </div>
    <div className={classes.sliderContainer}>
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

export default Eq3
