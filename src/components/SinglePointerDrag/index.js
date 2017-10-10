import React, { Component } from 'react'
import PropTypes from 'prop-types'

const normalizeEvent = event => {
  const { currentTarget, touches, timeStamp } = event
  const { clientX, clientY } = touches && touches.length ? touches[0] : event

  return { currentTarget, clientX, clientY, timeStamp }
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
      timeStamp: 0,
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
        ? {
            start: ['touchstart'],
            move: ['touchmove'],
            end: ['touchend', 'touchcancel'],
          }
        : { start: ['mousedown'], move: ['mousemove'], end: ['mouseup'] }
  }

  componentWillUnmount() {
    const { move, end } = this.eventNames

    move.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )
    end.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
    )
  }

  handleDragStart(event) {
    const { currentTarget, clientX, clientY, timeStamp } = normalizeEvent(event)
    const { move, end } = this.eventNames

    const targetRect = currentTarget.getBoundingClientRect()
    const targetStartX = clientX - targetRect.top
    const targetStartY = clientY - targetRect.left

    move.forEach(eventName =>
      window.addEventListener(eventName, this.handleDragMove),
    )
    end.forEach(eventName =>
      window.addEventListener(eventName, this.handleDragEnd),
    )

    this.setState(
      () => ({
        targetRect,
        targetStartX,
        targetStartY,
        timeStamp,
        x: clientX,
        y: clientY,
        isDragging: true,
        target: currentTarget,
        startX: clientX,
        startY: clientY,
        targetX: targetStartX,
        targetY: targetStartY,
      }),
      () => this.props.onDragStart({ ...this.state }),
    )
  }

  handleDragMove(event) {
    const { clientX, clientY, timeStamp } = normalizeEvent(event)

    this.setState(
      ({ targetRect, x, y }) => ({
        timeStamp,
        dx: clientX - x,
        dy: clientY - y,
        x: clientX,
        y: clientY,
        targetX: clientX - targetRect.left,
        targetY: clientY - targetRect.top,
      }),
      () => this.props.onDragMove({ ...this.state }),
    )
  }

  handleDragEnd(event) {
    const { move, end } = this.eventNames
    let { clientX, clientY } = normalizeEvent(event)

    if (clientX === undefined) ({ x: clientX } = this.state)
    if (clientY === undefined) ({ y: clientY } = this.state)

    move.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )
    end.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
    )

    this.setState(
      ({ targetRect, x, y }) => ({
        dx: clientX - x,
        dy: clientY - y,
        x: clientX,
        y: clientY,
        timeStamp: event.timeStamp,
        isDragging: false,
        targetX: clientX - targetRect.left,
        targetY: clientY - targetRect.top,
      }),
      () => this.props.onDragEnd({ ...this.state }),
    )
  }

  render() {
    const { start: [startEventName] } = this.eventNames
    const dragEvents =
      startEventName === 'touchstart'
        ? { onTouchStart: this.handleDragStart }
        : { onMouseDown: this.handleDragStart }

    return this.props.children({ dragEvents })
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
