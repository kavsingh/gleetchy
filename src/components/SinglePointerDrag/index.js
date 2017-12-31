import React, { Component } from 'react'
import { pipe, tap, always } from 'ramda'

import PropTypes from '~/PropTypes'
import { cancelEvent } from '~/util/event'
import { filterSupportedEvents } from '~/util/env'
import { noop } from '~/util/function'

const normalizeEvent = event => {
  const { currentTarget, touches, timeStamp } = event
  const { clientX, clientY } = touches && touches.length ? touches[0] : event

  return { currentTarget, clientX, clientY, timeStamp }
}

const cancelAndNormalizeEvent = pipe(tap(cancelEvent), normalizeEvent)

class SinglePointerDrag extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      targetRect: null,
      target: null,
      isDragging: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      startX: 0,
      startY: 0,
      targetStartX: 0,
      targetStartY: 0,
      movementX: 0,
      movementY: 0,
      displacementX: 0,
      displacementY: 0,
      timeStamp: 0,
      startTime: 0,
      duration: 0,
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
  }

  componentDidMount() {
    this.mouseMoveEvents = filterSupportedEvents(['mousemove'])
    this.mouseEndEvents = filterSupportedEvents(['mouseup'])
    this.touchMoveEvents = filterSupportedEvents(['touchmove'])
    this.touchEndEvents = filterSupportedEvents(['touchend', 'touchcancel'])
    this.moveEvents = [...this.mouseMoveEvents, ...this.touchMoveEvents]
    this.endEvents = [...this.mouseEndEvents, ...this.touchEndEvents]
  }

  componentWillUnmount() {
    this.moveEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )

    this.endEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
    )
  }

  // No point trying to cancel touchStart / mouseDown events - preventDefault
  // will be blocked by Chrome since React sets these listeners as passive by
  // default
  handleMouseDown(event) {
    this.registerDragStart(
      normalizeEvent(event),
      this.mouseMoveEvents,
      this.mouseEndEvents,
    )
  }

  handleTouchStart(event) {
    this.registerDragStart(
      normalizeEvent(event),
      this.touchMoveEvents,
      this.touchEndEvents,
    )
  }

  registerDragStart(normalisedEvent, moveEvents, endEvents) {
    if (this.state.isDragging) return

    const { currentTarget, clientX, clientY, timeStamp } = normalisedEvent

    const targetRect = currentTarget.getBoundingClientRect()
    const targetStartX = clientX - targetRect.top
    const targetStartY = clientY - targetRect.left

    moveEvents.forEach(eventName =>
      window.addEventListener(eventName, this.handleDragMove, {
        passive: false,
      }),
    )

    endEvents.forEach(eventName =>
      window.addEventListener(eventName, this.handleDragEnd, {
        passive: false,
      }),
    )

    this.setState(
      () => ({
        targetRect,
        targetStartX,
        targetStartY,
        timeStamp,
        target: currentTarget,
        isDragging: true,
        x: clientX,
        y: clientY,
        targetX: targetStartX,
        targetY: targetStartY,
        startX: clientX,
        startY: clientY,
        movementX: 0,
        movementY: 0,
        displacementX: 0,
        displacementY: 0,
        startTime: timeStamp,
        duration: 0,
      }),
      () => this.props.onDragStart({ ...this.state }),
    )
  }

  handleDragMove(event) {
    const { clientX, clientY, timeStamp } = cancelAndNormalizeEvent(event)

    this.setState(
      ({ targetRect, x, y, startTime, startX, startY }) => ({
        timeStamp,
        x: clientX,
        y: clientY,
        movementX: clientX - x,
        movementY: clientY - y,
        displacementX: clientX - startX,
        displacementY: clientY - startY,
        duration: timeStamp - startTime,
        targetX: clientX - targetRect.left,
        targetY: clientY - targetRect.top,
      }),
      () => this.props.onDragMove({ ...this.state }),
    )
  }

  handleDragEnd(event) {
    let { clientX, clientY } = cancelAndNormalizeEvent(event)

    if (clientX === undefined) ({ x: clientX } = this.state)
    if (clientY === undefined) ({ y: clientY } = this.state)

    this.moveEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )

    this.endEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
    )

    this.setState(
      ({ targetRect, x, y, startTime, startX, startY }) => ({
        movementX: clientX - x,
        movementY: clientY - y,
        displacementX: clientX - startX,
        displacementY: clientY - startY,
        x: clientX,
        y: clientY,
        timeStamp: event.timeStamp,
        duration: event.timeStamp - startTime,
        isDragging: false,
        targetX: clientX - targetRect.left,
        targetY: clientY - targetRect.top,
      }),
      () => this.props.onDragEnd({ ...this.state }),
    )
  }

  render() {
    return this.props.children({
      dragListeners: {
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleTouchStart,
      },
    })
  }
}

SinglePointerDrag.propTypes = {
  children: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
}

SinglePointerDrag.defaultProps = {
  children: always(<div />),
  onDragStart: noop,
  onDragMove: noop,
  onDragEnd: noop,
}

export default SinglePointerDrag
