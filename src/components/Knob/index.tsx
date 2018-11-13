import { Interpolation } from 'emotion'
import { always, clamp } from 'ramda'
import React, { PureComponent, ReactNode } from 'react'

import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'
import SVGArc from '~/components/SVGArc'
import {
  COLOR_EMPHASIS,
  COLOR_KEYLINE,
  LAYOUT_ABSOLUTE_FILL,
} from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

const renderEmptyString = always('')

const text = {
  flex: '0 0 auto',
  fontSize: '0.8em',
}

const classes = cssLabeled('knob', {
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },

  knobContainer: {
    cursor: 'move',
    flex: '0 0 auto',
    margin: '0.4em auto 0.3em',
    position: 'relative',

    '& svg': {
      fill: 'transparent',
      height: '100%',
      width: '100%',
    },
  },

  trackContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 1,

    '& svg': {
      stroke: COLOR_KEYLINE,
    },
  } as Interpolation,

  barContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 2,

    '& svg': {
      stroke: COLOR_EMPHASIS,
    },
  } as Interpolation,

  label: text,
  value: text,
})

export interface KnobProps {
  value: number
  defaultValue?: number
  radius?: number | string
  onChange?(value: number): void
  renderTitle?(): string
  renderLabel?(): ReactNode
  renderValue?(): ReactNode
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
          <div className={classes.root} title={renderTitle()}>
            <div className={classes.label}>{renderLabel()}</div>
            <div
              {...dragListeners}
              onDoubleClick={this.handleDoubleClick}
              role="presentation"
              className={classes.knobContainer}
              style={{ height: radius, width: radius, ...cursorStyles }}
              ref={el => (this.knobNode = el)}
            >
              <div className={classes.trackContainer}>
                <SVGArc startAngle={0} endAngle={360} strokeWidth={1} />
              </div>
              <div className={classes.barContainer}>
                <SVGArc startAngle={0} endAngle={value * 360} strokeWidth={2} />
              </div>
            </div>
            <div className={classes.value}>{renderValue()}</div>
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

export default Knob
