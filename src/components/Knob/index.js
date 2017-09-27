import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import SVGArc from '../SVGArc'

class Knob extends Component {
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
      <div className="root" title={renderTitle()}>
        <div className="label">{renderLabel()}</div>
        <div
          role="presentation"
          className="knob"
          style={{ width: radius, height: radius }}
          onMouseDown={this.handleMouseDown}
          ref={c => {
            this.knobNode = c
          }}
        >
          <div className="trackContainer">
            <SVGArc startAngle={0} endAngle={360} strokeWidth={1} />
          </div>
          <div className="barContainer">
            <SVGArc startAngle={0} endAngle={value * 360} strokeWidth={2} />
          </div>
        </div>
        <div className="value">{renderValue()}</div>
        <style jsx>{`
          .root {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
          }

          .knob {
            flex: 0 0 auto;
            position: relative;
            cursor: ew-resize;
          }

          .knob :global(svg) {
            width: 100%;
            height: 100%;
            fill: transparent;
          }

          .trackContainer,
          .barContainer {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          .trackContainer {
            z-index: 1;
          }

          .trackContainer :global(svg) {
            stroke: rgba(0, 0, 0, 0.1);
          }

          .trackContainer {
            z-index: 2;
          }

          .barContainer :global(svg) {
            stroke: #000;
          }

          .label,
          .value {
            font-size: 0.8em;
            flex: 0 0 auto;
          }

          .label {
            margin-bottom: 0.4em;
          }

          .value {
            margin-top: 0.4em;
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
  radius: '2.6em',
  renderTitle: () => {},
  renderLabel: () => {},
  renderValue: () => {},
  onChange: () => {},
}

export default Knob
