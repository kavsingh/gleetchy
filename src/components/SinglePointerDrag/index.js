import React, { Component } from 'react'
import PropTypes from 'prop-types'

const normalizeEvent = event => {
  const { currentTarget, touches, timeStamp } = event
  const { clientX, clientY } = touches ? touches[0] : event

  const normalized = { currentTarget, clientX, clientY, timeStamp }

  return normalized
}

class SinglePointerDrag extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      targetRect: null,
      target: null,
      isDragging: false,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      targetStartX: 0,
      targetStartY: 0,
      targetX: 0,
      targetY: 0,
    }

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
    const { currentTarget, clientX, clientY } = normalizeEvent(event)
    const { move, end } = this.eventNames

    const targetRect = currentTarget.getBoundingClientRect()
    const targetStartX = clientX - targetRect.top
    const targetStartY = clientY - targetRect.left

    window.addEventListener(move, this.handleDragMove)
    window.addEventListener(end, this.handleDragEnd)

    this.setState(
      () => ({
        targetRect,
        targetStartX,
        targetStartY,
        x: clientX,
        y: clientY,
        isDragging: true,
        target: currentTarget,
        startX: clientX,
        startY: clientY,
        targetX: targetStartX,
        targetY: targetStartY,
      }),
      () => this.props.onDragStart(this.state),
    )
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

    return this.props.children({ dragEvents, dragState: { ...this.state } })
  }
}

SinglePointerDrag.propTypes = {
  children: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
}

SinglePointerDrag.defaultProps = {
  children: () => <div />,
  onDragStart: () => {},
  onDragMove: () => {},
  onDragEnd: () => {},
}

export default SinglePointerDrag
