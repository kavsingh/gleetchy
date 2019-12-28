import React, { PureComponent } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import { clamp } from 'ramda'

import { noop } from '~/util/function'
import { ThemeProps } from '~/style/theme'
import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'

type Orientation = 'vertical' | 'horizontal'
type OrientationProps = { orientation: Orientation }

export interface SliderProps {
  value: number
  defaultValue?: number
  orientation?: Orientation
  label?: string
  valueLabel?: string
  title?: string
  onChange?(value: number): unknown
}

class Slider extends PureComponent<SliderProps> {
  private barContainer?: HTMLElement | null

  public render() {
    const {
      value,
      orientation = 'vertical',
      label = '',
      valueLabel = '',
      title = '',
    } = this.props
    const offVal = `${(1 - value) * 100}%`

    return (
      <Container orientation={orientation} title={title}>
        <Label orientation={orientation}>{label}</Label>
        <SinglePointerDrag
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          {({ dragListeners }) => (
            <BarContainer
              {...dragListeners}
              orientation={orientation}
              role="presentation"
              onDoubleClick={this.handleDoubleClick}
              ref={el => (this.barContainer = el)}
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

  private handleDragMove = ({
    movementX,
    movementY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) return

    const { orientation = 'vertical', value, onChange = noop } = this.props
    const isVert = orientation === 'vertical'
    const movement = isVert ? movementY : movementX
    const dim = isVert
      ? this.barContainer.offsetHeight * -1
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, movement / dim + value))
  }

  private handleDragEnd = ({
    movementX,
    movementY,
    duration,
    targetX,
    targetY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) return

    const { orientation = 'vertical', onChange = noop } = this.props
    const isVert = orientation === 'vertical'
    const movement = isVert ? movementY : movementX

    if (duration > 300 || movement > 4) {
      return
    }

    const offset = isVert ? targetY : targetX
    const dim = isVert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, isVert ? 1 - offset / dim : offset / dim))
  }

  private handleDoubleClick = () => {
    const { onChange = noop, defaultValue = 0.5 } = this.props

    onChange(defaultValue)
  }
}

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

const Label = styled(Text)<OrientationProps>(({ orientation }) =>
  orientation === 'horizontal'
    ? css`
        display: flex;
        align-items: center;
        width: 3em;
      `
    : css`
        height: 1.4em;
      `,
)

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

const Track = withTheme(styled.div<ThemeProps & OrientationProps>`
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
`)

const Bar = withTheme(styled.div<ThemeProps & OrientationProps>`
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
`)

export default withTheme(Slider)
