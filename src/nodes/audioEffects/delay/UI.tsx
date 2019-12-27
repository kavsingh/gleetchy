import React, { memo, FunctionComponent, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { always } from 'ramda'

import { AudioNodeConnection } from '~/types'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { noop } from '~/util/function'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'

const Container = styled.div<{ isActive: boolean }>`
  width: 100%;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  transition: opacity 0.2s ease-out;
`

const ControlsContainer = styled.div`
  display: flex;
  width: 100%;
`

const KnobContainer = styled.div`
  flex: 0 0 3em;
`

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
}) => {
  const handleTimeKnobChange = useCallback(
    (val: number) => {
      onDelayTimeChange(val * DELAY_UPPER_BOUND)
    },
    [onDelayTimeChange],
  )

  const titleBar = useMemo(
    () => (
      <TitleBar
        type="Delay"
        label={label}
        connections={connections}
        onLabelChange={onLabelChange}
        onRemoveClick={remove}
      />
    ),
    [connections, label, onLabelChange, remove],
  )

  const timeKnob = useMemo(
    () => (
      <Knob
        radius="2.4em"
        value={delayTime / DELAY_UPPER_BOUND}
        onChange={handleTimeKnobChange}
        renderLabel={renderTimeLabel}
        renderTitle={renderTimeTitle}
        renderValue={() => delayTime.toFixed(2)}
      />
    ),
    [delayTime, handleTimeKnobChange],
  )

  const wetDryKnob = useMemo(
    () => (
      <Knob
        radius="2.4em"
        value={wetDryRatio}
        onChange={onWetDryRatioChange}
        renderLabel={renderWetDryLabel}
        renderTitle={renderWetDryTitle}
        renderValue={() => `${(wetDryRatio * 100).toFixed(1)}%`}
      />
    ),
    [onWetDryRatioChange, wetDryRatio],
  )

  return (
    <Container isActive={isActive}>
      {titleBar}
      <ControlsContainer>
        <KnobContainer key="delayTime">{timeKnob}</KnobContainer>
        <KnobContainer key="delayWetDry">{wetDryKnob}</KnobContainer>
      </ControlsContainer>
    </Container>
  )
}

export default memo(Delay)
