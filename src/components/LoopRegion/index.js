import React, { Component } from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import { COLOR_PAGE } from '../../constants/style'
import { noop } from '../../util/function'
import SinglePointerDrag from '../SinglePointerDrag'
import LoopHandle from './LoopHandle'

class LoopRegion extends Component {
  constructor(...args) {
    super(...args)

    this.handleStartHandleDrag = this.handleStartHandleDrag.bind(this)
    this.handleEndHandleDrag = this.handleEndHandleDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
  }

  shouldComponentUpdate(props) {
    return (
      this.props.loopStart !== props.loopStart ||
      this.props.loopEnd !== props.loopEnd
    )
  }

  handleStartHandleDrag({ movementX }) {
    this.props.onLoopStartDrag(movementX / this.rootNode.offsetWidth)
  }

  handleEndHandleDrag({ movementX }) {
    this.props.onLoopEndDrag(movementX / this.rootNode.offsetWidth)
  }

  handleLoopRegionDrag({ movementX }) {
    this.props.onLoopRegionDrag(movementX / this.rootNode.offsetWidth)
  }

  render() {
    const { loopStart, loopEnd } = this.props
    const regionRatio = loopEnd - loopStart
    const preferRegionDrag = this.rootNode
      ? regionRatio * this.rootNode.offsetWidth < 30
      : false

    return (
      <div
        className="loopRegion"
        ref={c => {
          this.rootNode = c
        }}
      >
        <SinglePointerDrag onDragMove={this.handleStartHandleDrag}>
          {({ dragListeners }) => (
            <div
              {...dragListeners}
              role="presentation"
              className="loopRegion__handleContainer"
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
              className="loopRegion__handleContainer"
              style={{ left: `${loopEnd * 100}%` }}
            >
              <LoopHandle align="right" />
            </div>
          )}
        </SinglePointerDrag>
        <div className="loopRegion__regionsContainer">
          <div
            className="loopRegion__inactiveRegion"
            style={{ left: 0, right: `${(1 - loopStart) * 100}%` }}
          />
          {regionRatio < 1 ? (
            <SinglePointerDrag onDragMove={this.handleLoopRegionDrag}>
              {({ dragListeners }) => (
                <div
                  {...dragListeners}
                  role="presentation"
                  className="loopRegion__activeRegion"
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
            className="loopRegion__inactiveRegion"
            style={{ left: `${loopEnd * 100}%`, right: 0 }}
          />
        </div>
        <style jsx>{`
          .loopRegion {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .loopRegion__handleContainer {
            position: absolute;
            height: 100%;
            top: 0;
            cursor: ew-resize;
            width: 10px;
            z-index: 1;
          }

          .loopRegion__regionsContainer {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }

          .loopRegion__activeRegion,
          .loopRegion__inactiveRegion {
            position: absolute;
            top: 0;
            bottom: 0;
          }

          .loopRegion__activeRegion {
            cursor: move;
          }

          .loopRegion__inactiveRegion {
            z-index: 0;
            background-color: ${color(COLOR_PAGE)
              .alpha(0.8)
              .string()};
          }
        `}</style>
      </div>
    )
  }
}

LoopRegion.propTypes = {
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  onLoopStartDrag: PropTypes.func,
  onLoopEndDrag: PropTypes.func,
  onLoopRegionDrag: PropTypes.func,
}

LoopRegion.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  onLoopStartDrag: noop,
  onLoopEndDrag: noop,
  onLoopRegionDrag: noop,
}

export default LoopRegion
