import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp, identity } from 'ramda'

class Slider extends Component {
  constructor(...args) {
    super(...args)

    this.state = { mouseDownStartTime: 0 }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseDown({ timeStamp }) {
    this.setState({ mouseDownStartTime: timeStamp })

    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove(event) {
    const { orient, value } = this.props
    const vert = orient === 'vertical'
    const movement = vert ? event.movementY : event.movementX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, movement / -dim + value))
  }

  handleMouseUp(event) {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)

    const movement =
      this.props.orient === 'vertical' ? event.movementY : event.movementX
    const clickTime = event.timeStamp - this.state.mouseDownStartTime < 300
    const clickMove = movement < 4

    if (clickTime && clickMove) this.registerClick(event)
  }

  registerClick(event) {
    const { orient } = this.props
    const vert = orient === 'vertical'
    const offset = vert ? event.offsetY : event.offsetX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, 1 - offset / dim))
  }

  render() {
    const { orient, value, renderLabel, renderValue, renderTitle } = this.props
    const isVert = orient === 'vertical'
    const offVal = `${(1 - value) * 100}%`

    return (
      <div
        className={`root ${isVert ? 'rootVertical' : 'rootHorizontal'}`}
        title={renderTitle(value)}
      >
        <div className="label">{renderLabel(value)}</div>
        <div
          role="presentation"
          className="barContainer"
          onMouseDown={this.handleMouseDown}
          ref={c => {
            this.barContainer = c
          }}
        >
          <div className="track" />
          <div
            className="bar"
            style={isVert ? { top: offVal } : { right: offVal }}
          />
        </div>
        <div className="value">{renderValue(value)}</div>
        <style jsx>{`
          .root {
            width: 100%;
            height: 100%;
            display: flex;
            font-size: 0.8em;
            align-items: center;
          }

          .rootVertical {
            flex-direction: column;
          }

          .rootHorizontal {
            flex-direction: row;
          }

          .label {
            flex: 0 0 auto;
            margin-bottom: 0.4em;
          }

          .value {
            flex: 0 0 0;
            width: 100%;
          }

          .barContainer {
            position: relative;
            flex: 1 0 auto;
            width: 100%;
            margin-bottom: 0.2em;
            cursor: ns-resize;
          }

          .track,
          .bar {
            position: absolute;
            top: 0;
            bottom: 0;
          }

          .track {
            z-index: 1;
            width: 1px;
            left: 50%;
            background-color: rgba(0, 0, 0, 0.1);
          }

          .bar {
            z-index: 2;
            width: 3px;
            left: calc(50% - 1px);
            background-color: #000;
          }
        `}</style>
      </div>
    )
  }
}

Slider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  orient: PropTypes.oneOf(['vertical', 'horizontal']),
  renderLabel: PropTypes.func,
  renderValue: PropTypes.func,
  renderTitle: PropTypes.func,
}

Slider.defaultProps = {
  value: 0.5,
  onChange: () => {},
  orient: 'vertical',
  renderLabel: identity,
  renderValue: identity,
  renderTitle: identity,
}

export default Slider
