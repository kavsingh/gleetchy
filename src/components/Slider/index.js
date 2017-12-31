import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { clamp, identity } from 'ramda'

import PropTypes from '~/PropTypes'
import { COLOR_KEYLINE, COLOR_EMPHASIS } from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import SinglePointerDrag from '~/components/SinglePointerDrag'

const text = {
  flexGrow: '0 0 auto',
  fontSize: '0.8em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const classes = cssLabeled('slider', {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },

  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  horizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  label: text,

  value: text,

  labelVertical: {
    height: '1.4em',
  },

  valueVertical: {
    height: '1.4em',
    display: 'flex',
    alignItems: 'flex-end',
  },

  labelHorizontal: {
    display: 'flex',
    alignItems: 'center',
    width: '3em',
  },

  valueHorizontal: {
    display: 'flex',
    alignItems: 'center',
    width: '3em',
  },

  barContainer: {
    position: 'relative',
    flex: '1 1',
  },

  barContainerVertical: {
    width: '100%',
    cursor: 'ns-resize',
    margin: '0.4em auto 0.2em',
  },

  barContainerHorizontal: {
    cursor: 'ew-resize',
    height: '100%',
    margin: 'auto 0.6em',
  },

  track: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: COLOR_KEYLINE,
  },

  bar: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLOR_EMPHASIS,
  },

  trackVertical: {
    top: 0,
    bottom: 0,
    width: 1,
    left: '50%',
  },

  barVertical: {
    top: 0,
    bottom: 0,
    width: 3,
    left: 'calc(50% - 1px)',
  },

  trackHorizontal: {
    left: 0,
    right: 0,
    height: 1,
    top: '50%',
  },

  barHorizontal: {
    left: 0,
    right: 0,
    height: 3,
    top: 'calc(50% - 1px)',
  },
})

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
        className={classnames({
          [classes.root]: true,
          [classes.vertical]: isVert,
          [classes.horizontal]: !isVert,
        })}
        title={renderTitle(value)}
      >
        <div
          className={classnames({
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
          onDoubleClick={this.handleDoubleClick}
        >
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              className={classnames({
                [classes.barContainer]: true,
                [classes.barContainerVertical]: isVert,
                [classes.barContainerHorizontal]: !isVert,
              })}
              role="presentation"
              onDoubleClick={this.handleDoubleClick}
              ref={c => {
                this.barContainer = c
              }}
            >
              <div
                className={classnames({
                  [classes.track]: true,
                  [classes.trackVertical]: isVert,
                  [classes.trackHorizontal]: !isVert,
                })}
              />
              <div
                className={classnames({
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
          className={classnames({
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
