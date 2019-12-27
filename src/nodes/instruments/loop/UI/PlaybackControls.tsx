import React, { memo, FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { always } from 'ramda'

import { noop } from '~/util/function'
import Knob from '~/components/Knob'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

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
  <Container>
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
  </Container>
)

export default memo(PlaybackControls)
