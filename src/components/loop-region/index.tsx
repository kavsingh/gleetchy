import React, { Component } from 'react'
import color from 'color'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import { noop } from '~/lib/util'
import { UITheme } from '~/style/theme'
import { layoutAbsoluteFill } from '~/style/layout'
import SinglePointerDrag, {
  SinglePointerDragState,
} from '~/components/single-pointer-drag'

import LoopHandle from './loop-handle'

const rootStyle = css({
  height: '100%',
  position: 'relative',
  width: '100%',
})

const handleContainerStyle = css({
  cursor: 'ew-resize',
  height: '100%',
  position: 'absolute',
  top: 0,
  width: 10,
  zIndex: 1,
})

const activeRegionStyle = css({
  bottom: 0,
  cursor: 'move',
  position: 'absolute',
  top: 0,
})

const inactiveRegionStyle = (theme: UITheme) =>
  css({
    backgroundColor: color(theme.colors.page).alpha(0.8).string(),
    bottom: 0,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  })

export interface LoopRegionProps {
  loopStart: number
  loopEnd: number
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
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
      <div css={rootStyle} ref={(c) => (this.rootNode = c)}>
        <SinglePointerDrag onDragMove={this.handleStartHandleDrag}>
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              role="presentation"
              css={handleContainerStyle}
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
              css={handleContainerStyle}
              style={{ left: `${loopEnd * 100}%` }}
            >
              <LoopHandle align="right" />
            </div>
          )}
        </SinglePointerDrag>
        <div css={layoutAbsoluteFill}>
          <div
            css={inactiveRegionStyle}
            style={{ left: 0, right: `${(1 - loopStart) * 100}%` }}
          />
          {regionRatio < 1 ? (
            <SinglePointerDrag onDragMove={this.handleLoopRegionDrag}>
              {({ dragListeners }) => (
                <div
                  {...dragListeners}
                  role="presentation"
                  css={activeRegionStyle}
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
            css={inactiveRegionStyle}
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

export default withTheme(LoopRegion)
