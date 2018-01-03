import React from 'react'
import { cx } from 'emotion'

import PropTypes from '~/PropTypes'
import { COLOR_EMPHASIS } from '~/constants/style'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('loopHandle', {
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
  },

  alignRight: {
    transform: 'translateX(-100%)',
  },

  tag: {
    position: 'absolute',
    top: 0,
    pointerEvents: 'all',
    height: 1,
    width: '60%',
    backgroundColor: COLOR_EMPHASIS,
  },

  tagAlignLeft: {
    left: 0,
  },

  tagAlignRight: {
    right: 0,
  },

  bar: {
    position: 'absolute',
    top: 0,
    pointerEvents: 'all',
    height: '100%',
    width: '100%',
  },

  barAlignLeft: {
    left: '-100%',
    borderRight: `1px solid ${COLOR_EMPHASIS}`,
  },

  barAlignRight: {
    right: '-100%',
    borderLeft: `1px solid ${COLOR_EMPHASIS}`,
  },
})

const LoopHandle = ({ align = 'left' }) => (
  <div
    className={cx({
      [classes.root]: true,
      [classes.alignRight]: align === 'right',
    })}
  >
    <div
      className={cx({
        [classes.tag]: true,
        [classes.tagAlignLeft]: align === 'left',
        [classes.tagAlignRight]: align === 'right',
      })}
    />
    <div
      className={cx({
        [classes.bar]: true,
        [classes.barAlignLeft]: align === 'left',
        [classes.barAlignRight]: align === 'right',
      })}
    />
  </div>
)

LoopHandle.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
}

LoopHandle.defaultProps = {
  align: 'left',
}

export default LoopHandle
