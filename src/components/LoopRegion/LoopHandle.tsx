import { cx } from 'emotion'
import React, { memo, StatelessComponent } from 'react'

import { COLOR_EMPHASIS } from '~/constants/style'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('loopHandle', {
  root: {
    height: '100%',
    pointerEvents: 'none',
    position: 'relative',
    width: '100%',
  },

  alignRight: {
    transform: 'translateX(-100%)',
  },

  tag: {
    backgroundColor: COLOR_EMPHASIS,
    height: 1,
    pointerEvents: 'all',
    position: 'absolute',
    top: 0,
    width: '60%',
  },

  tagAlignLeft: {
    left: 0,
  },

  tagAlignRight: {
    right: 0,
  },

  bar: {
    height: '100%',
    pointerEvents: 'all',
    position: 'absolute',
    top: 0,
    width: '100%',
  },

  barAlignLeft: {
    borderRight: `1px solid ${COLOR_EMPHASIS}`,
    left: '-100%',
  },

  barAlignRight: {
    borderLeft: `1px solid ${COLOR_EMPHASIS}`,
    right: '-100%',
  },
})

export interface LoopHandleProps {
  align: 'left' | 'right'
}

const LoopHandle: StatelessComponent<LoopHandleProps> = ({
  align = 'left',
}) => (
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

export default memo(LoopHandle)
