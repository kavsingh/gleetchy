import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import { COLOR_KEYLINE, COLOR_EMPHASIS } from '../../constants/style'
import { noop } from '../../util/function'
import SinglePointerDrag from '../SinglePointerDrag'
import SVGArc from '../SVGArc'

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
          <div className="knob" title={renderTitle()}>
            <div className="knob__label">{renderLabel()}</div>
            <div
              {...dragListeners}
              onDoubleClick={this.handleDoubleClick}
              role="presentation"
              className="knob__knobContainer"
              style={{
                width: radius,
                height: radius,
                ...cursorStyles,
              }}
              ref={c => {
                this.knobNode = c
              }}
            >
              <div className="knob__trackContainer">
                <SVGArc startAngle={0} endAngle={360} strokeWidth={1} />
              </div>
              <div className="knob__barContainer">
                <SVGArc startAngle={0} endAngle={value * 360} strokeWidth={2} />
              </div>
            </div>
            <div className="knob__value">{renderValue()}</div>
            <style jsx>{`
              .knob {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 100%;
              }

              .knob__knobContainer {
                flex: 0 0 auto;
                position: relative;
                cursor: move;
                margin: 0.4em auto 0.3em;
              }

              .knob__knobContainer :global(svg) {
                width: 100%;
                height: 100%;
                fill: transparent;
              }

              .knob__trackContainer,
              .knob__barContainer {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
              }

              .knob__trackContainer {
                z-index: 1;
              }

              .knob__trackContainer :global(svg) {
                stroke: ${COLOR_KEYLINE};
              }

              .knob__barContainer {
                z-index: 2;
              }

              .knob__barContainer :global(svg) {
                stroke: ${COLOR_EMPHASIS};
              }

              .knob__label,
              .knob__value {
                font-size: 0.8em;
                flex: 0 0 auto;
              }
            `}</style>
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
