import { memo, useRef, useEffect, useCallback } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { clamp } from 'ramda'

import { noop } from '~/lib/util'
import SinglePointerDrag from '~/components/single-pointer-drag'
import type {
  SinglePointerDragMoveHandler,
  SinglePointerDragEndHandler,
} from '~/components/single-pointer-drag'
import type { FCWithoutChildren } from '~/types'

import useControlResponseRef, {
  ControlResponseMultipliers,
} from './hooks/use-control-response-ref'

const clampValue = clamp(0, 1)
const controlMultipliers: ControlResponseMultipliers = {
  normal: 2,
  fine: 0.4,
}

const Slider: FCWithoutChildren<{
  value: number
  defaultValue?: number
  orientation?: Orientation
  label?: string
  valueLabel?: string
  title?: string
  onChange?(value: number): unknown
}> = ({
  value,
  defaultValue = 0.5,
  orientation = 'vertical',
  label = '',
  valueLabel = '',
  title = '',
  onChange = noop,
}) => {
  const moveMultiplierRef = useControlResponseRef(controlMultipliers)
  const barRef = useRef<HTMLDivElement | null>(null)
  const valueRef = useRef<number>(value)

  const handleDoubleClick = useCallback(() => {
    onChange(defaultValue)
  }, [onChange, defaultValue])

  const handleDragMove = useCallback<SinglePointerDragMoveHandler>(
    ({ movementX, movementY }) => {
      const { current: bar } = barRef

      if (!bar) return

      const isVert = orientation === 'vertical'
      const movement = isVert ? movementY : movementX
      const dim = isVert ? bar.offsetHeight * -1 : bar.offsetWidth

      onChange(
        clampValue(
          (movement * moveMultiplierRef.current) / dim + valueRef.current,
        ),
      )
    },
    [orientation, onChange, moveMultiplierRef],
  )

  const handleDragEnd = useCallback<SinglePointerDragEndHandler>(
    ({ duration, movementX, movementY, targetX, targetY }) => {
      const { current: bar } = barRef

      if (!bar) return

      const isVert = orientation === 'vertical'
      const movement = isVert ? movementY : movementX

      if (duration > 300 || movement > 4) return

      const offset = isVert ? targetY : targetX
      const dim = isVert ? bar.offsetHeight : bar.offsetWidth

      onChange(clampValue(isVert ? 1 - offset / dim : offset / dim))
    },
    [orientation, onChange],
  )

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const offVal = `${(1 - value) * 100}%`

  return (
    <Container orientation={orientation} title={title}>
      <Label orientation={orientation}>{label}</Label>
      <SinglePointerDrag onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
        {({ dragListeners }) => (
          <BarContainer
            {...dragListeners}
            orientation={orientation}
            role="presentation"
            onDoubleClick={handleDoubleClick}
            ref={barRef}
          >
            <Track orientation={orientation} />
            <Bar
              orientation={orientation}
              style={
                orientation === 'horizontal'
                  ? { right: offVal }
                  : { top: offVal }
              }
            />
          </BarContainer>
        )}
      </SinglePointerDrag>
      <ValueLabel orientation={orientation}>{valueLabel}</ValueLabel>
    </Container>
  )
}

export default memo(Slider)

const Container = styled.div<OrientationProps>`
  display: flex;
  width: 100%;
  height: 100%;
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          flex-direction: row;
          align-items: stretch;
        `
      : css`
          flex-direction: column;
          align-items: center;
        `}
`

const Text = styled.div`
  flex: 0 0 auto;
  overflow: hidden;
  font-size: 0.8em;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Label = styled(Text)<OrientationProps>`
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          display: flex;
          align-items: center;
          width: 3em;
        `
      : css`
          height: 1.4em;
        `};
`

const ValueLabel = styled(Text)<OrientationProps>`
  display: flex;
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          align-items: center;
          width: 3em;
        `
      : css`
          align-items: flex-end;
          height: 1.4em;
        `};
`

const BarContainer = styled.div<OrientationProps>`
  position: relative;
  flex: 1 1;
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          height: 100%;
          margin: auto 0.6em;
          cursor: ew-resize;
        `
      : css`
          width: 100%;
          margin: 0.4em auto 0.2em;
          cursor: ns-resize;
        `}
`

const Track = styled.div<OrientationProps>`
  position: absolute;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.keyline};
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          top: 50%;
          right: 0;
          left: 0;
          height: 1px;
        `
      : css`
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
        `};
`

const Bar = styled.div<OrientationProps>`
  position: absolute;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.emphasis};
  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          top: calc(50% - 1px);
          right: 0;
          left: 0;
          height: 3px;
        `
      : css`
          top: 0;
          bottom: 0;
          left: calc(50% - 1px);
          width: 3px;
        `};
`

type Orientation = 'vertical' | 'horizontal'
type OrientationProps = { orientation: Orientation }
