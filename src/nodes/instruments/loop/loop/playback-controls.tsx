import React, { memo, FunctionComponent, useMemo, useCallback } from 'react'
import styled from '@emotion/styled'

import { noop } from '~/lib/util'
import Knob from '~/components/knob'

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

const PlaybackControls: FunctionComponent<PlaybackControlsProps> = ({
  gain = 1,
  playbackRate = 1,
  onGainChange = noop,
  onPlaybackRateChange = noop,
}) => {
  const handlePlaybackRateChange = useCallback(
    (val: number) => onPlaybackRateChange(val * 2),
    [onPlaybackRateChange],
  )

  const gainKnob = useMemo(
    () => (
      <Knob
        value={gain}
        title="Gain"
        label="G"
        valueLabel={gain.toFixed(2)}
        onChange={onGainChange}
      />
    ),
    [gain, onGainChange],
  )

  const speedKnob = useMemo(
    () => (
      <Knob
        value={playbackRate * 0.5}
        title="Speed"
        label="S"
        valueLabel={playbackRate.toFixed(2)}
        onChange={handlePlaybackRateChange}
      />
    ),
    [handlePlaybackRateChange, playbackRate],
  )

  return (
    <Container>
      <div key="gain">{gainKnob}</div>
      <div key="speed">{speedKnob}</div>
    </Container>
  )
}

export default memo(PlaybackControls)
