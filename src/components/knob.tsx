import React, { PureComponent } from 'react'
import { css } from '@emotion/core'
import { clamp } from 'ramda'
import { withTheme } from 'emotion-theming'

import { PropsWithoutChildren } from '~/types'
import { noop } from '~/lib/util'
import { layoutAbsoluteFill } from '~/style/layout'
import { UITheme } from '~/style/theme'
import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/single-pointer-drag'
import SVGArc from '~/components/svg-arc'

const labelStyle = css({
  flex: '0 0 auto',
  fontSize: '0.8em',
})

const rootStyle = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
})

const knobContainerStyle = css({
  cursor: 'move',
  flex: '0 0 auto',
  margin: '0.4em auto 0.3em',
  position: 'relative',
})

export interface KnobProps {
  value: number
  defaultValue?: number
  radius?: number | string
  title?: string
  label?: string
  valueLabel?: string
  onChange?(value: number): unknown
  theme: UITheme
}

interface KnobState {
  axis?: string
}

class Knob extends PureComponent<PropsWithoutChildren<KnobProps>, KnobState> {
  public state = { axis: undefined }

  private knobNode?: HTMLElement | null

  public render() {
    const { axis } = this.state
    const {
      value = 0.5,
      radius = '2.4em',
      title = '',
      label = '',
      valueLabel = '',
      theme,
    } = this.props

    const cursorStyles = axis
      ? { cursor: axis === 'x' ? 'ew-resize' : 'ns-resize' }
      : {}

    return (
      <SinglePointerDrag
        onDragStart={this.resetAxis}
        onDragEnd={this.resetAxis}
        onDragMove={this.handleDragMove}
      >
        {({ dragListeners }) => (
          <div css={rootStyle} title={title}>
            <div css={labelStyle}>{label}</div>
            <div
              {...dragListeners}
              onDoubleClick={this.handleDoubleClick}
              role="presentation"
              css={knobContainerStyle}
              style={{ height: radius, width: radius, ...cursorStyles }}
              ref={el => (this.knobNode = el)}
            >
              <div css={layoutAbsoluteFill}>
                <SVGArc
                  endRatio={value}
                  strokeWidth={6}
                  backgroundStrokeWidth={3}
                  strokeColor={theme.colors.emphasis}
                  backgroundStrokeColor={theme.colors.keyline}
                />
              </div>
            </div>
            <div css={labelStyle}>{valueLabel}</div>
          </div>
        )}
      </SinglePointerDrag>
    )
  }

  private resetAxis = () => {
    this.setState(() => ({ axis: undefined }))
  }

  private handleDragMove = ({
    movementX,
    movementY,
  }: SinglePointerDragState) => {
    const { onChange = noop, value } = this.props
    const { axis } = this.state
    const { knobNode } = this

    if (!knobNode) {
      return
    }

    const moveAxis =
      axis || (Math.abs(movementX) > Math.abs(movementY) ? 'x' : 'y')

    const move =
      moveAxis === 'x'
        ? movementX / knobNode.offsetWidth
        : -movementY / knobNode.offsetHeight

    onChange(clamp(0, 1, value + move))

    if (!axis) {
      this.setState(() => ({ axis: moveAxis }))
    }
  }

  private handleDoubleClick = () => {
    const { onChange = noop, defaultValue = 0.5 } = this.props

    onChange(defaultValue)
  }
}

export default withTheme(Knob)