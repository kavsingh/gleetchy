import { pipe, tap } from 'ramda'
import { PureComponent, ReactNode } from 'react'

import { filterSupportedEvents } from '~/util/env'
import { cancelEvent } from '~/util/event'
import { noop } from '~/util/function'

type MouseOrTouchEvent =
  | Event
  | MouseEvent
  | TouchEvent
  | React.MouseEvent<any>
  | React.TouchEvent<any>

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

const cancelAndNormalizeEvent = pipe(
  tap(cancelEvent),
  normalizeEvent,
)

interface ChildRenderProps {
  dragListeners: {
    onMouseDown(event: React.MouseEvent<any>): void
    onTouchStart(event: React.TouchEvent<any>): void
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
  onDragStart?(state: Partial<SinglePointerDragState>): void
  onDragMove?(state: Partial<SinglePointerDragState>): void
  onDragEnd?(state: Partial<SinglePointerDragState>): void
}

type MoveEvent = 'mousemove' | 'touchmove'
type EndEvent = 'mouseup' | 'mouseleave' | 'touchend' | 'touchcancel'

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

  private mouseMoveEvents: Array<'mousemove'> = []
  private mouseEndEvents: Array<'mouseup'> = []
  private touchMoveEvents: Array<'touchmove'> = []
  private touchEndEvents: Array<'touchend' | 'touchcancel'> = []
  private moveEvents: MoveEvent[] = []
  private endEvents: EndEvent[] = []

  public componentDidMount() {
    this.mouseMoveEvents = filterSupportedEvents(['mousemove'])
    this.mouseEndEvents = filterSupportedEvents(['mouseup'])
    this.touchMoveEvents = filterSupportedEvents(['touchmove'])
    this.touchEndEvents = filterSupportedEvents(['touchend', 'touchcancel'])
    this.moveEvents = [...this.mouseMoveEvents, ...this.touchMoveEvents]
    this.endEvents = [...this.mouseEndEvents, ...this.touchEndEvents]
  }

  public componentWillUnmount() {
    this.moveEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )

    this.endEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
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
  private handleMouseDown = (event: React.MouseEvent<any>) => {
    this.registerDragStart(
      normalizeEvent(event),
      this.mouseMoveEvents,
      this.mouseEndEvents,
    )
  }

  private handleTouchStart = (event: React.TouchEvent<any>) => {
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
    if (this.state.isDragging) {
      return
    }

    const { onDragStart = noop } = this.props
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
    const { onDragEnd = noop } = this.props
    let { clientX, clientY } = cancelAndNormalizeEvent(event as Event)

    if (clientX === undefined) {
      clientX = this.state.x
    }

    if (clientY === undefined) {
      clientY = this.state.y
    }

    this.moveEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragMove),
    )

    this.endEvents.forEach(eventName =>
      window.removeEventListener(eventName, this.handleDragEnd),
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