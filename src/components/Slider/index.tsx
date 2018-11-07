import { cx, Interpolation } from 'emotion'
import { clamp } from 'ramda'
import React, { PureComponent, ReactNode } from 'react'

import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'
import { COLOR_EMPHASIS, COLOR_KEYLINE } from '~/constants/style'
import { noop, stubString } from '~/util/function'
import { cssLabeled } from '~/util/style'

const text = {
  flexGrow: '0 0 auto',
  fontSize: '0.8em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const classes = cssLabeled('slider', {
  horizontal: {
    alignItems: 'stretch',
    flexDirection: 'row',
  },

  label: text as Interpolation,

  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },

  value: text as Interpolation,

  vertical: {
    alignItems: 'center',
    flexDirection: 'column',
  },

  labelVertical: {
    height: '1.4em',
  },

  valueVertical: {
    alignItems: 'flex-end',
    display: 'flex',
    height: '1.4em',
  },

  labelHorizontal: {
    alignItems: 'center',
    display: 'flex',
    width: '3em',
  },

  valueHorizontal: {
    alignItems: 'center',
    display: 'flex',
    width: '3em',
  },

  barContainer: {
    flex: '1 1',
    position: 'relative',
  },

  barContainerVertical: {
    cursor: 'ns-resize',
    margin: '0.4em auto 0.2em',
    width: '100%',
  },

  barContainerHorizontal: {
    cursor: 'ew-resize',
    height: '100%',
    margin: 'auto 0.6em',
  },

  track: {
    backgroundColor: COLOR_KEYLINE,
    position: 'absolute',
    zIndex: 1,
  },

  bar: {
    backgroundColor: COLOR_EMPHASIS,
    position: 'absolute',
    zIndex: 2,
  },

  trackVertical: {
    bottom: 0,
    left: '50%',
    top: 0,
    width: 1,
  },

  barVertical: {
    bottom: 0,
    left: 'calc(50% - 1px)',
    top: 0,
    width: 3,
  },

  trackHorizontal: {
    height: 1,
    left: 0,
    right: 0,
    top: '50%',
  },

  barHorizontal: {
    height: 3,
    left: 0,
    right: 0,
    top: 'calc(50% - 1px)',
  },
})

export interface SliderProps {
  value: number
  defaultValue?: number
  orient?: 'vertical' | 'horizontal'
  onChange?(value: number): void
  renderLabel?(value: number): ReactNode
  renderValue?(value: number): ReactNode
  renderTitle?(value: number): string
}

class Slider extends PureComponent<SliderProps> {
  private barContainer?: HTMLElement | null

  public render() {
    const {
      value,
      orient = 'vertical',
      renderLabel = stubString,
      renderValue = String,
      renderTitle = String,
    } = this.props
    const isVert = orient === 'vertical'
    const offVal = `${(1 - value) * 100}%`

    return (
      <div
        className={cx({
          [classes.root]: true,
          [classes.vertical]: isVert,
          [classes.horizontal]: !isVert,
        })}
        title={renderTitle(value)}
      >
        <div
          className={cx({
            [classes.label]: true,
            [classes.labelVertical]: isVert,
            [classes.labelHorizontal]: !isVert,
          })}
        >
          {renderLabel(value)}
        </div>
        <SinglePointerDrag
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              className={cx({
                [classes.barContainer]: true,
                [classes.barContainerVertical]: isVert,
                [classes.barContainerHorizontal]: !isVert,
              })}
              role="presentation"
              onDoubleClick={this.handleDoubleClick}
              ref={el => (this.barContainer = el)}
            >
              <div
                className={cx({
                  [classes.track]: true,
                  [classes.trackVertical]: isVert,
                  [classes.trackHorizontal]: !isVert,
                })}
              />
              <div
                className={cx({
                  [classes.bar]: true,
                  [classes.barVertical]: isVert,
                  [classes.barHorizontal]: !isVert,
                })}
                style={isVert ? { top: offVal } : { right: offVal }}
              />
            </div>
          )}
        </SinglePointerDrag>
        <div
          className={cx({
            [classes.value]: true,
            [classes.valueVertical]: isVert,
            [classes.valueHorizontal]: !isVert,
          })}
        >
          {renderValue(value)}
        </div>
      </div>
    )
  }

  private handleDragMove = ({
    movementX,
    movementY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) {
      return
    }

    const { orient = 'vertical', value, onChange = noop } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX
    const dim = isVert
      ? this.barContainer.offsetHeight * -1
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, movement / dim + value))
  }

  private handleDragEnd = ({
    movementX,
    movementY,
    duration,
    targetX,
    targetY,
  }: SinglePointerDragState) => {
    if (!this.barContainer) {
      return
    }

    const { orient = 'vertical', onChange = noop } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX

    if (duration > 300 || movement > 4) {
      return
    }

    const offset = isVert ? targetY : targetX
    const dim = isVert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    onChange(clamp(0, 1, isVert ? 1 - offset / dim : offset / dim))
  }

  private handleDoubleClick = () => {
    const { onChange = noop, defaultValue = 0.5 } = this.props

    onChange(defaultValue)
  }
}

export default Slider
