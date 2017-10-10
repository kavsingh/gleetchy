import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clamp, identity } from 'ramda'
import SinglePointerDrag from '../SinglePointerDrag'

class Slider extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = { dragStartTime: 0 }

    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
  }

  handleDragStart({ timeStamp }) {
    this.setState({ dragStartTime: timeStamp })
  }

  handleDragMove({ dx, dy }) {
    const { orient, value } = this.props
    const vert = orient === 'vertical'
    const movement = vert ? dy : dx
    const dim = vert
      ? this.barContainer.offsetHeight * -1
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, movement / dim + value))
  }

  handleDragEnd({ dx, dy, timeStamp, targetX, targetY }) {
    const movement = this.props.orient === 'vertical' ? dy : dx
    const clickTime = timeStamp - this.state.dragStartTime < 300
    const clickMove = movement < 4

    if (clickTime && clickMove) {
      this.registerClick({ offsetX: targetX, offsetY: targetY })
    }
  }

  registerClick({ offsetX, offsetY }) {
    const { orient } = this.props
    const vert = orient === 'vertical'
    const offset = vert ? offsetY : offsetX
    const dim = vert
      ? this.barContainer.offsetHeight
      : this.barContainer.offsetWidth

    this.props.onChange(clamp(0, 1, vert ? 1 - offset / dim : offset / dim))
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
          onDragStart={this.handleDragStart}
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              role="presentation"
              className="slider__barContainer"
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
            align-items: center;
          }

          .slider_vertical {
            flex-direction: column;
          }

          .slider_horizontal {
            flex-direction: row;
            align-items: stretch;
          }

          .slider__label,
          .slider__value {
            flex: 0 0 auto;
            font-size: 0.8em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
            background-color: rgba(0, 0, 0, 0.1);
          }

          .slider__bar {
            z-index: 2;
            background-color: #000;
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
