import React, { memo, FunctionComponent } from 'react'
import { css } from 'emotion'
import { always } from 'ramda'

import { noop } from '~/util/function'
import Knob from '~/components/Knob'

const rootStyle = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between',
})

export interface PlaybackControlsProps {
  gain: number
  playbackRate: number
  onGainChange(gain: number): unknown
  onPlaybackRateChange(playbackRate: number): unknown
}

const renderGainTitle = always('Gain')
const renderGainLabel = always('G')
const renderSpeedTitle = always('Speed')
const renderSpeedLabel = always('S')

const PlaybackControls: FunctionComponent<PlaybackControlsProps> = ({
  gain = 1,
  playbackRate = 1,
  onGainChange = noop,
  onPlaybackRateChange = noop,
}) => (
  <div className={rootStyle}>
    <div>
      <Knob
        value={gain}
        renderTitle={renderGainTitle}
        renderLabel={renderGainLabel}
        renderValue={() => gain.toFixed(2)}
        onChange={onGainChange}
      />
    </div>
    <div>
      <Knob
        value={playbackRate * 0.5}
        renderTitle={renderSpeedTitle}
        renderLabel={renderSpeedLabel}
        renderValue={() => playbackRate.toFixed(2)}
        onChange={val => onPlaybackRateChange(val * 2)}
      />
    </div>
  </div>
)

export default memo(PlaybackControls)
