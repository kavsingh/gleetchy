import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { clamp } from 'ramda'

import { noop } from '~/lib/util'
import { layoutAbsoluteFill } from '~/style/layout'

import useControlResponseRef from './hooks/use-control-response-ref'
import SinglePointerDrag from './single-pointer-drag'
import SVGArc from './svg-arc'

import type { FC } from 'react'
import type { ControlResponseMultipliers } from './hooks/use-control-response-ref'
import type { SinglePointerDragMoveHandler } from './single-pointer-drag'

const clampMove = clamp(0, 1)
const controlMultipliers: ControlResponseMultipliers = {
  normal: 1,
  fine: 0.2,
}

const Knob: FC<{
  value: number
  defaultValue?: number
  radius?: number | string
  title?: string
  label?: string
  valueLabel?: string
  onChange?(value: number): unknown
}> = ({
  value,
  defaultValue = 0.5,
  radius = '2.4em',
  title = '',
  label = '',
  valueLabel = '',
  onChange = noop,
}) => {
  const theme = useTheme()
  const knobRef = useRef<HTMLDivElement | null>(null)
  const valueRef = useRef<number>(value)
  const [axis, setAxis] = useState<MovementAxis | undefined>()
  const moveMultiplierRef = useControlResponseRef(controlMultipliers)

  const resetAxis = useCallback(() => setAxis(undefined), [])

  const handleDoubleClick = useCallback(() => {
    onChange(defaultValue)
  }, [onChange, defaultValue])

  const handleDragMove = useCallback<SinglePointerDragMoveHandler>(
    ({ movementX, movementY }) => {
      const { current: knob } = knobRef

      if (!knob) return

      const moveAxis =
        axis ||
        (Math.abs(movementX) > Math.abs(movementY) ? 'horizontal' : 'vertical')

      const move =
        moveAxis === 'horizontal'
          ? movementX / knob.offsetWidth
          : -movementY / knob.offsetHeight

      onChange(clampMove(valueRef.current + move * moveMultiplierRef.current))

      if (!axis) setAxis(moveAxis)
    },
    [axis, onChange, moveMultiplierRef],
  )

  useEffect(() => {
    valueRef.current = value
  }, [value])

  return (
    <SinglePointerDrag
      onDragStart={resetAxis}
      onDragEnd={resetAxis}
      onDragMove={handleDragMove}
    >
      {({ dragListeners }) => (
        <Container title={title}>
          <Label>{label}</Label>
          <KnobContainer
            {...dragListeners}
            radius={radius}
            axis={axis}
            onDoubleClick={handleDoubleClick}
            role="presentation"
            ref={knobRef}
          >
            <KnobSVGContainer>
              <SVGArc
                endRatio={value}
                strokeWidth={6}
                backgroundStrokeWidth={3}
                strokeColor={theme.colors.emphasis}
                backgroundStrokeColor={theme.colors.keyline}
              />
            </KnobSVGContainer>
          </KnobContainer>
          <Label>{valueLabel}</Label>
        </Container>
      )}
    </SinglePointerDrag>
  )
}

export default memo(Knob)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Label = styled.div`
  flex: 0 0 auto;
  font-size: 0.8em;
`

const KnobContainer = styled.div<{
  radius: number | string
  axis?: MovementAxis
}>`
  position: relative;
  flex: 0 0 auto;
  width: ${({ radius }) => radius};
  height: ${({ radius }) => radius};
  margin: 0.4em auto 0.3em;
  cursor: ${({ axis }) =>
    !axis ? 'move' : axis === 'vertical' ? 'ns-resize' : 'ew-resize'};
`

const KnobSVGContainer = styled.div`
  ${layoutAbsoluteFill}
`

type MovementAxis = 'vertical' | 'horizontal'
