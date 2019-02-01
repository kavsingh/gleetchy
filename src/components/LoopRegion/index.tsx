import color from 'color'
import { Interpolation } from 'emotion'
import React, { Component } from 'react'

import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/SinglePointerDrag'
import { COLOR_PAGE, LAYOUT_ABSOLUTE_FILL } from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

import LoopHandle from './LoopHandle'

/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
const classes = cssLabeled('loopRegion', {
  root: {
    height: '100%',
    position: 'relative',
    width: '100%',
  },

  handleContainer: {
    cursor: 'ew-resize',
    height: '100%',
    position: 'absolute',
    top: 0,
    width: 10,
    zIndex: 1,
  },

  regionsContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
  } as Interpolation,

  activeRegion: {
    bottom: 0,
    cursor: 'move',
    position: 'absolute',
    top: 0,
  },

  inactiveRegion: {
    backgroundColor: color(COLOR_PAGE)
      .alpha(0.8)
      .string(),
    bottom: 0,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  },
})
/* eslint-enable @typescript-eslint/no-object-literal-type-assertion */

export interface LoopRegionProps {
  loopStart: number
  loopEnd: number
  onLoopStartDrag?(movement: number): void
  onLoopEndDrag?(movement: number): void
  onLoopRegionDrag?(movement: number): void
}

class LoopRegion extends Component<LoopRegionProps> {
  private rootNode?: HTMLDivElement | null

  public shouldComponentUpdate(props: LoopRegionProps) {
    return (
      this.props.loopStart !== props.loopStart ||
      this.props.loopEnd !== props.loopEnd
    )
  }

  public render() {
    const { loopStart = 0, loopEnd = 1 } = this.props
    const regionRatio = loopEnd - loopStart
    const preferRegionDrag = this.rootNode
      ? regionRatio * this.rootNode.offsetWidth < 30
      : false

    return (
      <div className={classes.root} ref={c => (this.rootNode = c)}>
        <SinglePointerDrag onDragMove={this.handleStartHandleDrag}>
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              role="presentation"
              className={classes.handleContainer}
              style={{ left: `${loopStart * 100}%` }}
            >
              <LoopHandle align="left" />
            </div>
          )}
        </SinglePointerDrag>
        <SinglePointerDrag onDragMove={this.handleEndHandleDrag}>
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              role="presentation"
              className={classes.handleContainer}
              style={{ left: `${loopEnd * 100}%` }}
            >
              <LoopHandle align="right" />
            </div>
          )}
        </SinglePointerDrag>
        <div className={classes.regionsContainer}>
          <div
            className={classes.inactiveRegion}
            style={{ left: 0, right: `${(1 - loopStart) * 100}%` }}
          />
          {regionRatio < 1 ? (
            <SinglePointerDrag onDragMove={this.handleLoopRegionDrag}>
              {({ dragListeners }) => (
                <div
                  {...dragListeners}
                  role="presentation"
                  className={classes.activeRegion}
                  style={{
                    left: `${loopStart * 100}%`,
                    right: `${(1 - loopEnd) * 100}%`,
                    zIndex: preferRegionDrag ? 2 : 0,
                  }}
                />
              )}
            </SinglePointerDrag>
          ) : null}
          <div
            className={classes.inactiveRegion}
            style={{ left: `${loopEnd * 100}%`, right: 0 }}
          />
        </div>
      </div>
    )
  }

  private handleStartHandleDrag = ({ movementX }: SinglePointerDragState) => {
    if (!this.rootNode) {
      return
    }

    const { onLoopStartDrag = noop } = this.props

    onLoopStartDrag(movementX / this.rootNode.offsetWidth)
  }

  private handleEndHandleDrag = ({ movementX }: SinglePointerDragState) => {
    if (!this.rootNode) {
      return
    }

    const { onLoopEndDrag = noop } = this.props

    onLoopEndDrag(movementX / this.rootNode.offsetWidth)
  }

  private handleLoopRegionDrag = ({ movementX }: SinglePointerDragState) => {
    if (!this.rootNode) {
      return
    }

    const { onLoopRegionDrag = noop } = this.props

    onLoopRegionDrag(movementX / this.rootNode.offsetWidth)
  }
}

export default LoopRegion
