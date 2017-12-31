import React, { PureComponent } from 'react'
import { clamp } from 'ramda'

import PropTypes from '~/PropTypes'
import {
  COLOR_KEYLINE,
  COLOR_EMPHASIS,
  LAYOUT_ABSOLUTE_FILL,
} from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import SinglePointerDrag from '~/components/SinglePointerDrag'
import SVGArc from '~/components/SVGArc'

const text = {
  fontSize: '0.8em',
  flex: '0 0 auto',
}

const classes = cssLabeled('knob', {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  knobContainer: {
    flex: '0 0 auto',
    position: 'relative',
    cursor: 'move',
    margin: '0.4em auto 0.3em',

    '& svg': {
      width: '100%',
      height: '100%',
      fill: 'transparent',
    },
  },

  trackContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 1,

    '& svg': {
      stroke: COLOR_KEYLINE,
    },
  },

  barContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 2,

    '& svg': {
      stroke: COLOR_EMPHASIS,
    },
  },

  label: text,
  value: text,
})

class Knob extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = { axis: undefined }

    this.resetAxis = this.resetAxis.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
  }

  resetAxis() {
    this.setState(() => ({ axis: undefined }))
  }

  handleDragMove({ movementX, movementY }) {
    const { axis } = this.state
    const { knobNode } = this

    if (!knobNode) return

    const moveAxis =
      axis || (Math.abs(movementX) > Math.abs(movementY) ? 'x' : 'y')

    const move =
      moveAxis === 'x'
        ? movementX / knobNode.offsetWidth
        : -movementY / knobNode.offsetHeight

    this.props.onChange(clamp(0, 1, this.props.value + move))

    if (!axis) this.setState(() => ({ axis: moveAxis }))
  }

  handleDoubleClick() {
    this.props.onChange(this.props.defaultValue)
  }

  render() {
    const { axis } = this.state
    const { value, radius, renderTitle, renderLabel, renderValue } = this.props

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
              style={{
                width: radius,
                height: radius,
                ...cursorStyles,
              }}
              ref={c => {
                this.knobNode = c
              }}
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
}

Knob.propTypes = {
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  renderTitle: PropTypes.func,
  renderLabel: PropTypes.func,
  renderValue: PropTypes.func,
  onChange: PropTypes.func,
}

Knob.defaultProps = {
  value: 0.5,
  defaultValue: 0.5,
  radius: '2.4em',
  renderTitle: noop,
  renderLabel: noop,
  renderValue: noop,
  onChange: noop,
}

export default Knob
