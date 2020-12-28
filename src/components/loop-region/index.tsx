import { useCallback, useRef, memo } from 'react'
import styled from '@emotion/styled'
import { memoizeWith, identity } from 'ramda'
import color from 'color'

import { noop } from '~/lib/util'
import { layoutAbsoluteFill } from '~/style/layout'
import type { FCWithoutChildren } from '~/types'
import type { ThemeProps } from '~/style/theme'

import SinglePointerDrag from '../single-pointer-drag'
import LoopHandle from './loop-handle'
import type { SinglePointerDragState } from '../single-pointer-drag'
import useControlResponseRef from '../hooks/use-control-response-ref'

const controlResponseMultipliers = {
  normal: 1,
  fine: 0.4,
}

const LoopRegion: FCWithoutChildren<{
  loopStart: number
  loopEnd: number
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
}> = ({
  loopStart,
  loopEnd,
  onLoopStartDrag = noop,
  onLoopEndDrag = noop,
  onLoopRegionDrag = noop,
}) => {
  const moveMultiplierRef = useControlResponseRef(controlResponseMultipliers)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleStartHandleDrag = useCallback(
    ({ movementX }: SinglePointerDragState) => {
      if (containerRef.current) {
        onLoopStartDrag(
          (movementX * moveMultiplierRef.current) /
            containerRef.current.offsetWidth,
        )
      }
    },
    [onLoopStartDrag, moveMultiplierRef],
  )

  const handleEndHandleDrag = useCallback(
    ({ movementX }: SinglePointerDragState) => {
      if (containerRef.current) {
        onLoopEndDrag(
          (movementX * moveMultiplierRef.current) /
            containerRef.current.offsetWidth,
        )
      }
    },
    [onLoopEndDrag, moveMultiplierRef],
  )

  const handleLoopRegionDrag = useCallback(
    ({ movementX }: SinglePointerDragState) => {
      if (containerRef.current) {
        onLoopRegionDrag(
          (movementX * moveMultiplierRef.current) /
            containerRef.current.offsetWidth,
        )
      }
    },
    [onLoopRegionDrag, moveMultiplierRef],
  )

  const regionRatio = loopEnd - loopStart
  const preferRegionDrag = containerRef.current
    ? regionRatio * containerRef.current.offsetWidth < 30
    : false

  return (
    <Container ref={containerRef}>
      <SinglePointerDrag onDragMove={handleStartHandleDrag}>
        {({ dragListeners }) => (
          <HandleContainer
            {...dragListeners}
            role="presentation"
            offset={loopStart}
          >
            <LoopHandle align="left" />
          </HandleContainer>
        )}
      </SinglePointerDrag>
      <SinglePointerDrag onDragMove={handleEndHandleDrag}>
        {({ dragListeners }) => (
          <HandleContainer
            {...dragListeners}
            role="presentation"
            offset={loopEnd}
          >
            <LoopHandle align="right" />
          </HandleContainer>
        )}
      </SinglePointerDrag>
      <RegionsContainer>
        <InactiveRegion start={0} end={loopStart} />
        {regionRatio < 1 ? (
          <SinglePointerDrag onDragMove={handleLoopRegionDrag}>
            {({ dragListeners }) => (
              <ActiveRegion
                {...dragListeners}
                start={loopStart}
                end={loopEnd}
                preferred={preferRegionDrag}
              />
            )}
          </SinglePointerDrag>
        ) : null}
        <InactiveRegion start={loopEnd} end={1} />
      </RegionsContainer>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const HandleContainer = styled.div<{ offset: number }>`
  position: absolute;
  top: 0;
  left: ${({ offset }) => offset * 100}%;
  z-index: 1;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
`

const RegionsContainer = styled.div`
  ${layoutAbsoluteFill}
`

const Region = styled.div<{ start: number; end: number }>`
  position: absolute;
  top: 0;
  right: ${({ end }) => `${(1 - end) * 100}%`};
  bottom: 0;
  left: ${({ start }) => `${start * 100}%`};
`

const ActiveRegion = styled(Region)<{
  preferred: boolean
}>`
  z-index: ${({ preferred }) => (preferred ? 2 : 0)};
  cursor: move;
`

const inactiveOverlayColor = memoizeWith(identity, (baseColor: string) =>
  color(baseColor).alpha(0.8).string(),
)

const InactiveRegion = styled(Region)<ThemeProps>`
  z-index: 0;
  background-color: ${({ theme }) => inactiveOverlayColor(theme.colors.page)};
`

export default memo(
  LoopRegion,
  (prevProps, nextProps) =>
    prevProps.loopStart === nextProps.loopStart &&
    prevProps.loopEnd === nextProps.loopEnd,
)
