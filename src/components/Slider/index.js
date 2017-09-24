import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp, identity } from 'ramda'
import classNames from './Slider.css'

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
        className={isVert ? classNames.rootVertical : classNames.rootHorizontal}
        title={renderTitle(value)}
      >
        <div className={classNames.label}>{renderLabel(value)}</div>
        <div
          role="presentation"
          className={classNames.barContainer}
          onMouseDown={this.handleMouseDown}
          ref={c => {
            this.barContainer = c
          }}
        >
          <div className={classNames.track} />
          <div
            className={classNames.bar}
            style={isVert ? { top: offVal } : { right: offVal }}
          />
        </div>
        <div className={classNames.value}>{renderValue(value)}</div>
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
