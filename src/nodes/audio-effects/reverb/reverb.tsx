import { memo, useMemo } from 'react'
import styled from '@emotion/styled'

import { noop } from '~/lib/util'
import Knob from '~/components/knob'
import TitleBar from '~/components/title-bar'
import type { AudioNodeConnection, FCWithoutChildren } from '~/types'

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

export interface ReverbProps {
  label: string
  wetDryRatio: number
  isActive: boolean
  connections: AudioNodeConnection[]
  onWetDryRatioChange(wetDryRatio: number): unknown
  onLabelChange(label: string): unknown
  remove(): unknown
}

const Reverb: FCWithoutChildren<ReverbProps> = ({
  label = 'Reverb',
  wetDryRatio = 0.5,
  isActive = true,
  connections = [],
  onWetDryRatioChange = noop,
  onLabelChange = noop,
  remove = noop,
}) => {
  const titleBar = useMemo(
    () => (
      <TitleBar
        type="Reverb"
        label={label}
        connections={connections}
        onLabelChange={onLabelChange}
        onRemoveClick={remove}
      />
    ),
    [connections, label, onLabelChange, remove],
  )

  const wetDryKnob = useMemo(
    () => (
      <Knob
        radius="2.4em"
        value={wetDryRatio}
        onChange={onWetDryRatioChange}
        label="W / D"
        title="Wet / Dry Ratio"
        valueLabel={`${(wetDryRatio * 100).toFixed(1)}%`}
      />
    ),
    [onWetDryRatioChange, wetDryRatio],
  )

  return (
    <Container isActive={isActive}>
      {titleBar}
      <ControlsContainer>
        <KnobContainer key="wetDry">{wetDryKnob}</KnobContainer>
      </ControlsContainer>
    </Container>
  )
}

export default memo(Reverb)
