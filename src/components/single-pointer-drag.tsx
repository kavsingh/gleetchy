import { PureComponent, ReactNode } from 'react'
import rafThrottle from 'raf-throttle'
import { pipe, tap } from 'ramda'

import { cancelEvent, noop } from '~/lib/util'
import { filterSupportedEvents, requireWindowWith } from '~/lib/env'

type MouseOrTouchEvent =
  | Event
  | MouseEvent
  | TouchEvent
  | React.MouseEvent
  | React.TouchEvent

interface NormalizedEvent {
  currentTarget: HTMLElement
  clientX: number
  clientY: number
  timeStamp: number
}

const normalizeEvent = (event: MouseOrTouchEvent): NormalizedEvent => {
  const { currentTarget, timeStamp } = event
  const { clientX = 0, clientY = 0 } = (event as TouchEvent).touches
    ? (event as TouchEvent).touches[0]
    : (event as MouseEvent)

  return {
    clientX,
    clientY,
    currentTarget: currentTarget as HTMLElement,
    timeStamp,
  }
}

const cancelAndNormalizeEvent = pipe(tap(cancelEvent), normalizeEvent)

interface ChildRenderProps {
  dragListeners: {
    onMouseDown(event: React.MouseEvent): unknown
    onTouchStart(event: React.TouchEvent): unknown
  }
}

export interface SinglePointerDragState {
  displacementX: number
  displacementY: number
  duration: number
  isDragging: boolean
  movementX: number
  movementY: number
  startTime: number
  startX: number
  startY: number
  target: HTMLElement | null
  targetRect: ClientRect | DOMRect | null
  targetStartX: number
  targetStartY: number
  targetX: number
  targetY: number
  timeStamp: number
  x: number
  y: number
}

export interface SinglePointerDragProps {
  children(props: ChildRenderProps): ReactNode
  onDragStart?(state: Partial<SinglePointerDragState>): unknown
  onDragMove?(state: Partial<SinglePointerDragState>): unknown
  onDragEnd?(state: Partial<SinglePointerDragState>): unknown
}

class SinglePointerDrag extends PureComponent<
  SinglePointerDragProps,
  SinglePointerDragState
> {
  public state = {
    displacementX: 0,
    displacementY: 0,
    duration: 0,
    isDragging: false,
    movementX: 0,
    movementY: 0,
    startTime: 0,
    startX: 0,
    startY: 0,
    target: null,
    targetRect: null,
    targetStartX: 0,
    targetStartY: 0,
    targetX: 0,
    targetY: 0,
    timeStamp: 0,
    x: 0,
    y: 0,
  }

  private mouseMoveEvents: string[] = []
  private mouseEndEvents: string[] = []
  private touchMoveEvents: string[] = []
  private touchEndEvents: string[] = []
  private moveEvents: string[] = []
  private endEvents: string[] = []
  private throttledHandleDragMove: (event: MouseOrTouchEvent) => void

  public constructor(props: SinglePointerDragProps, context: unknown) {
    super(props, context)

    this.throttledHandleDragMove = rafThrottle(this.handleDragMove)
  }

  public componentDidMount() {
    this.mouseMoveEvents = filterSupportedEvents(['mousemove'])
    this.mouseEndEvents = filterSupportedEvents(['mouseup'])
    this.touchMoveEvents = filterSupportedEvents(['touchmove'])
    this.touchEndEvents = filterSupportedEvents(['touchend', 'touchcancel'])
    this.moveEvents = [...this.mouseMoveEvents, ...this.touchMoveEvents]
    this.endEvents = [...this.mouseEndEvents, ...this.touchEndEvents]
  }

  public componentWillUnmount() {
    const WINDOW = requireWindowWith(['removeEventListener'])

    if (!WINDOW) {
      return
    }

    this.moveEvents.forEach(eventName =>
      WINDOW.removeEventListener(eventName, this.handleDragMove),
    )

    this.endEvents.forEach(eventName =>
      WINDOW.removeEventListener(eventName, this.handleDragEnd),
    )
  }

  public render() {
    return this.props.children({
      dragListeners: {
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleTouchStart,
      },
    })
  }

  // No point trying to cancel touchStart / mouseDown events - preventDefault
  // will be blocked by Chrome since React sets these listeners as passive by
  // default
  private handleMouseDown = (event: React.MouseEvent) => {
    this.registerDragStart(
      normalizeEvent(event),
      this.mouseMoveEvents,
      this.mouseEndEvents,
    )
  }

  private handleTouchStart = (event: React.TouchEvent) => {
    this.registerDragStart(
      normalizeEvent(event),
      this.touchMoveEvents,
      this.touchEndEvents,
    )
  }

  private registerDragStart(
    normalisedEvent: NormalizedEvent,
    moveEvents: string[],
    endEvents: string[],
  ) {
    const WINDOW = requireWindowWith(['addEventListener'])

    if (!WINDOW || this.state.isDragging) {
      return
    }

    const { onDragStart = noop } = this.props
    const { currentTarget, clientX, clientY, timeStamp } = normalisedEvent

    const targetRect = currentTarget.getBoundingClientRect()
    const targetStartX = clientX - targetRect.top
    const targetStartY = clientY - targetRect.left

    moveEvents.forEach(eventName =>
      WINDOW.addEventListener(eventName, this.throttledHandleDragMove, {
        passive: false,
      }),
    )

    endEvents.forEach(eventName =>
      WINDOW.addEventListener(eventName, this.handleDragEnd, {
        passive: false,
      }),
    )

    this.setState(
      () => ({
        displacementX: 0,
        displacementY: 0,
        duration: 0,
        isDragging: true,
        movementX: 0,
        movementY: 0,
        startTime: timeStamp,
        startX: clientX,
        startY: clientY,
        target: currentTarget,
        targetRect,
        targetStartX,
        targetStartY,
        targetX: targetStartX,
        targetY: targetStartY,
        timeStamp,
        x: clientX,
        y: clientY,
      }),
      () => onDragStart({ ...this.state }),
    )
  }

  private handleDragMove = (event: MouseOrTouchEvent) => {
    const { onDragMove = noop } = this.props
    const { clientX, clientY, timeStamp } = cancelAndNormalizeEvent(
      event as Event,
    )

    this.setState(
      ({ targetRect, x, y, startTime, startX, startY }) => ({
        displacementX: clientX - startX,
        displacementY: clientY - startY,
        duration: timeStamp - startTime,
        movementX: clientX - x,
        movementY: clientY - y,
        targetX: clientX - (targetRect ? targetRect.left : 0),
        targetY: clientY - (targetRect ? targetRect.top : 0),
        timeStamp,
        x: clientX,
        y: clientY,
      }),
      () => onDragMove({ ...this.state }),
    )
  }

  private handleDragEnd = (event: MouseOrTouchEvent) => {
    const WINDOW = requireWindowWith(['removeEventListener'])

    if (!WINDOW) {
      return
    }

    const { onDragEnd = noop } = this.props
    let { clientX, clientY } = cancelAndNormalizeEvent(event as Event)

    if (clientX === undefined) {
      clientX = this.state.x
    }

    if (clientY === undefined) {
      clientY = this.state.y
    }

    this.moveEvents.forEach(eventName =>
      WINDOW.removeEventListener(eventName, this.throttledHandleDragMove),
    )

    this.endEvents.forEach(eventName =>
      WINDOW.removeEventListener(eventName, this.handleDragEnd),
    )

    this.setState(
      ({ targetRect, x, y, startTime, startX, startY }) => ({
        displacementX: clientX - startX,
        displacementY: clientY - startY,
        duration: event.timeStamp - startTime,
        isDragging: false,
        movementX: clientX - x,
        movementY: clientY - y,
        targetX: clientX - (targetRect ? targetRect.left : 0),
        targetY: clientY - (targetRect ? targetRect.top : 0),
        timeStamp: event.timeStamp,
        x: clientX,
        y: clientY,
      }),
      () => onDragEnd({ ...this.state }),
    )
  }
}

export default SinglePointerDrag
