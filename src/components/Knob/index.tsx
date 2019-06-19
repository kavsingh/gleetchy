import React, { PureComponent, ReactNode } from 'react'
import { css } from '@emotion/core'
import { always, clamp } from 'ramda'
import { withTheme } from 'emotion-theming'

import { noop } from '~/util/function'
import { layoutAbsoluteFill } from '~/style/layout'
import { UITheme } from '~/style/theme'
import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'
import SVGArc from '~/components/SVGArc'

const renderEmptyString = always('')

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

  '& svg': {
    fill: 'transparent',
    height: '100%',
    width: '100%',
  },
})

const trackContainerStyle = (theme: UITheme) =>
  css({
    zIndex: 1,

    '& svg': {
      stroke: theme.colorKeyline,
    },
  })

const barContainerStyle = (theme: UITheme) =>
  css({
    zIndex: 2,

    '& svg': {
      stroke: theme.colorEmphasis,
    },
  })

export interface KnobProps {
  value: number
  defaultValue?: number
  radius?: number | string
  onChange?(value: number): unknown
  renderTitle?(): string
  renderLabel?(): ReactNode
  renderValue?(): ReactNode
  theme: UITheme
}

interface KnobState {
  axis?: string
}

class Knob extends PureComponent<KnobProps, KnobState> {
  public state = { axis: undefined }

  private knobNode?: HTMLElement | null

  public render() {
    const { axis } = this.state
    const {
      value = 0.5,
      radius = '2.4em',
      renderTitle = renderEmptyString,
      renderLabel = renderEmptyString,
      renderValue = renderEmptyString,
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
          <div css={rootStyle} title={renderTitle()}>
            <div css={labelStyle}>{renderLabel()}</div>
            <div
              {...dragListeners}
              onDoubleClick={this.handleDoubleClick}
              role="presentation"
              css={knobContainerStyle}
              style={{ height: radius, width: radius, ...cursorStyles }}
              ref={el => (this.knobNode = el)}
            >
              <div css={[layoutAbsoluteFill, trackContainerStyle(theme)]}>
                <SVGArc startAngle={0} endAngle={360} strokeWidth={1} />
              </div>
              <div css={[layoutAbsoluteFill, barContainerStyle(theme)]}>
                <SVGArc startAngle={0} endAngle={value * 360} strokeWidth={2} />
              </div>
            </div>
            <div css={labelStyle}>{renderValue()}</div>
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
