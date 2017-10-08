import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import SVGArc from '../SVGArc'

class Knob extends PureComponent {
  constructor(...args) {
    super(...args)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseDown() {
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove({ movementX }) {
    if (!this.knobNode) return

    this.props.onChange(
      clamp(0, 1, this.props.value + movementX / this.knobNode.offsetWidth),
    )
  }

  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const { value, radius, renderTitle, renderLabel, renderValue } = this.props

    return (
      <div className="knob" title={renderTitle()}>
        <div className="knob__label">{renderLabel()}</div>
        <div
          role="presentation"
          className="knob__knobContainer"
          style={{ width: radius, height: radius }}
          onMouseDown={this.handleMouseDown}
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
            cursor: ew-resize;
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
            stroke: rgba(0, 0, 0, 0.1);
          }

          .knob__barContainer {
            z-index: 2;
          }

          .knob__barContainer :global(svg) {
            stroke: #000;
          }

          .knob__label,
          .knob__value {
            font-size: 0.8em;
            flex: 0 0 auto;
          }
        `}</style>
      </div>
    )
  }
}

Knob.propTypes = {
  value: PropTypes.number,
  radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  renderTitle: PropTypes.func,
  renderLabel: PropTypes.func,
  renderValue: PropTypes.func,
  onChange: PropTypes.func,
}

Knob.defaultProps = {
  value: 0.5,
  radius: '2.4em',
  renderTitle: () => {},
  renderLabel: () => {},
  renderValue: () => {},
  onChange: () => {},
}

export default Knob
