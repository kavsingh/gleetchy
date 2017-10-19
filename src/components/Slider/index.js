import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clamp, identity } from 'ramda'
import { COLOR_KEYLINE, COLOR_EMPHASIS } from '../../constants/style'
import { noop } from '../../util/function'
import SinglePointerDrag from '../SinglePointerDrag'

class Slider extends PureComponent {
  constructor(...args) {
    super(...args)

    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
  }

  handleDragMove({ movementX, movementY }) {
    const { orient, value } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX
    const dim = isVert
      ? this.barContainer.offsetHeight * -1
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, movement / dim + value))
  }

  handleDragEnd({ movementX, movementY, duration, targetX, targetY }) {
    const { orient } = this.props
    const isVert = orient === 'vertical'
    const movement = isVert ? movementY : movementX

    if (duration > 300 || movement > 4) return

    const offset = isVert ? targetY : targetX
    const dim = isVert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, isVert ? 1 - offset / dim : offset / dim))
  }

  handleDoubleClick() {
    this.props.onChange(this.props.defaultValue)
  }

  render() {
    const { orient, value, renderLabel, renderValue, renderTitle } = this.props
    const isVert = orient === 'vertical'
    const offVal = `${(1 - value) * 100}%`

    return (
      <div
        className={`slider ${isVert ? 'slider_vertical' : 'slider_horizontal'}`}
        title={renderTitle(value)}
      >
        <div className="slider__label">{renderLabel(value)}</div>
        <SinglePointerDrag
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
          onDoubleClick={this.handleDoubleClick}
        >
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              className="slider__barContainer"
              role="presentation"
              onDoubleClick={this.handleDoubleClick}
              ref={c => {
                this.barContainer = c
              }}
            >
              <div className="slider__track" />
              <div
                className="slider__bar"
                style={isVert ? { top: offVal } : { right: offVal }}
              />
            </div>
          )}
        </SinglePointerDrag>
        <div className="slider__value">{renderValue(value)}</div>
        <style jsx>{`
          .slider {
            width: 100%;
            height: 100%;
            display: flex;
          }

          .slider_vertical {
            flex-direction: column;
            align-items: center;
          }

          .slider_horizontal {
            flex-direction: row;
            align-items: stretch;
          }

          .slider__label,
          .slider__value {
            flex-grow: 0 0 auto;
            font-size: 0.8em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .slider_vertical .slider__value,
          .slider_vertical .slider__label {
            height: 1.4em;
          }

          .slider_vertical .slider__value {
            display: flex;
            align-items: flex-end;
          }

          .slider_horizontal .slider__value,
          .slider_horizontal .slider__label {
            display: flex;
            align-items: center;
            width: 3em;
          }

          .slider__barContainer {
            position: relative;
            flex: 1 1;
          }

          .slider_vertical .slider__barContainer {
            width: 100%;
            cursor: ns-resize;
            margin: 0.4em auto 0.2em;
          }

          .slider_horizontal .slider__barContainer {
            cursor: ew-resize;
            height: 100%;
            margin: auto 0.6em;
          }

          .slider__track,
          .slider__bar {
            position: absolute;
          }

          .slider__track {
            z-index: 1;
            background-color: ${COLOR_KEYLINE};
          }

          .slider__bar {
            z-index: 2;
            background-color: ${COLOR_EMPHASIS};
          }

          .slider_vertical .slider__track,
          .slider_vertical .slider__bar {
            top: 0;
            bottom: 0;
          }

          .slider_horizontal .slider__track,
          .slider_horizontal .slider__bar {
            left: 0;
            right: 0;
          }

          .slider_vertical .slider__track {
            width: 1px;
            left: 50%;
          }

          .slider_vertical .slider__bar {
            width: 3px;
            left: calc(50% - 1px);
          }

          .slider_horizontal .slider__track {
            height: 1px;
            top: 50%;
          }

          .slider_horizontal .slider__bar {
            height: 3px;
            top: calc(50% - 1px);
          }
        `}</style>
      </div>
    )
  }
}

Slider.propTypes = {
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  orient: PropTypes.oneOf(['vertical', 'horizontal']),
  onChange: PropTypes.func,
  renderLabel: PropTypes.func,
  renderValue: PropTypes.func,
  renderTitle: PropTypes.func,
}

Slider.defaultProps = {
  value: 0.5,
  defaultValue: 0.5,
  orient: 'vertical',
  onChange: noop,
  renderLabel: identity,
  renderValue: identity,
  renderTitle: identity,
}

export default Slider
