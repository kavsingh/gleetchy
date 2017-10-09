import React, { Component } from 'react'
import PropTypes from 'prop-types'

const normalizeEvent = event => (event.touches ? event.touches[0] : event)

class PointerDragable extends Component {
  constructor(...args) {
    super(...args)

    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
  }

  componentWillMount() {
    this.eventNames =
      'ontouchstart' in document || 'ontouchstart' in document.documentElement
        ? { start: 'touchstart', move: 'touchmove', end: 'touchend' }
        : { start: 'mousedown', move: 'mousemove', end: 'mouseup' }
  }

  componentWillUnmount() {
    const { move, end } = this.eventNames

    window.removeEventListener(move, this.handleDragMove)
    window.removeEventListener(end, this.handleDragEnd)
  }

  handleDragStart(event) {
    const { move, end } = this.eventNames

    window.addEventListener(move, this.handleDragMove)
    window.addEventListener(end, this.handleDragEnd)

    this.props.onDragStart(normalizeEvent(event))
  }

  handleDragMove(event) {
    this.props.onDragMove(normalizeEvent(event))
  }

  handleDragEnd(event) {
    const { move, end } = this.eventNames

    window.removeEventListener(move, this.handleDragMove)
    window.removeEventListener(end, this.handleDragEnd)

    this.props.onDragEnd(normalizeEvent(event))
  }

  render() {
    const { start } = this.eventNames
    const dragEvents =
      start === 'touchstart'
        ? { onTouchStart: this.handleDragStart }
        : { onMouseDown: this.handleDragStart }

    return this.props.children({ dragEvents })
  }
}

PointerDragable.propTypes = {
  children: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
}

PointerDragable.defaultProps = {
  children: () => <div />,
  onDragStart: () => {},
  onDragMove: () => {},
  onDragEnd: () => {},
}

export default PointerDragable
