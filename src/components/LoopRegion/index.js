import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoopHandle from './LoopHandle'

class LoopRegion extends Component {
  constructor(...args) {
    super(...args)

    this.handleStartHandleMouseDown = this.handleStartHandleMouseDown.bind(this)
    this.handleStartHandleMouseMove = this.handleStartHandleMouseMove.bind(this)
    this.handleStartHandleMouseUp = this.handleStartHandleMouseUp.bind(this)
    this.handleEndHandleMouseDown = this.handleEndHandleMouseDown.bind(this)
    this.handleEndHandleMouseMove = this.handleEndHandleMouseMove.bind(this)
    this.handleEndHandleMouseUp = this.handleEndHandleMouseUp.bind(this)
    this.handleLoopRegionMouseDown = this.handleLoopRegionMouseDown.bind(this)
    this.handleLoopRegionMouseMove = this.handleLoopRegionMouseMove.bind(this)
    this.handleLoopRegionMouseUp = this.handleLoopRegionMouseUp.bind(this)
  }

  shouldComponentUpdate(props) {
    return (
      this.props.loopStart !== props.loopStart ||
      this.props.loopEnd !== props.loopEnd
    )
  }

  componentWillUnmount() {
    this.handleStartHandleMouseUp()
    this.handleEndHandleMouseUp()
    this.handleLoopRegionMouseUp()
  }

  handleStartHandleMouseDown() {
    window.addEventListener('mousemove', this.handleStartHandleMouseMove)
    window.addEventListener('mouseup', this.handleStartHandleMouseUp)
  }

  handleStartHandleMouseMove(event) {
    this.props.onLoopStartDrag(event.movementX / this.rootNode.offsetWidth)
  }

  handleStartHandleMouseUp() {
    window.removeEventListener('mouseup', this.handleStartHandleMouseUp)
    window.removeEventListener('mousemove', this.handleStartHandleMouseMove)
  }

  handleEndHandleMouseDown() {
    window.addEventListener('mousemove', this.handleEndHandleMouseMove)
    window.addEventListener('mouseup', this.handleEndHandleMouseUp)
  }

  handleEndHandleMouseMove(event) {
    this.props.onLoopEndDrag(event.movementX / this.rootNode.offsetWidth)
  }

  handleEndHandleMouseUp() {
    window.removeEventListener('mouseup', this.handleEndHandleMouseUp)
    window.removeEventListener('mousemove', this.handleEndHandleMouseMove)
  }

  handleLoopRegionMouseDown() {
    window.addEventListener('mousemove', this.handleLoopRegionMouseMove)
    window.addEventListener('mouseup', this.handleLoopRegionMouseUp)
  }

  handleLoopRegionMouseMove({ movementX }) {
    this.props.onLoopRegionDrag(movementX / this.rootNode.offsetWidth)
  }

  handleLoopRegionMouseUp() {
    window.removeEventListener('mousemove', this.handleLoopRegionMouseMove)
    window.removeEventListener('mouseup', this.handleLoopRegionMouseUp)
  }

  render() {
    const { loopStart, loopEnd } = this.props

    return (
      <div
        className="loopRegion"
        ref={c => {
          this.rootNode = c
        }}
      >
        <div
          role="presentation"
          className="loopRegion__handleContainer"
          style={{ left: `${loopStart * 100}%` }}
          onMouseDown={this.handleStartHandleMouseDown}
        >
          <LoopHandle align="left" />
        </div>
        <div
          role="presentation"
          className="loopRegion__handleContainer"
          style={{ left: `${loopEnd * 100}%` }}
          onMouseDown={this.handleEndHandleMouseDown}
        >
          <LoopHandle align="right" />
        </div>
        <div className="loopRegion__regionsContainer">
          <div
            className="loopRegion__inactiveRegion"
            style={{ left: 0, right: `${(1 - loopStart) * 100}%` }}
          />
          <div
            role="presentation"
            className="loopRegion__activeRegion"
            onMouseDown={this.handleLoopRegionMouseDown}
            style={{
              left: `${loopStart * 100}%`,
              right: `${(1 - loopEnd) * 100}%`,
            }}
          />
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
            z-index: 2;
            cursor: ew-resize;
            width: 10px;
            transform: translateX(-5px);
          }

          .loopRegion__regionsContainer {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
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
            background-color: rgba(255, 255, 255, 0.8);
          }
        `}</style>
      </div>
    )
  }
}

LoopRegion.propTypes = {
  onLoopEndDrag: PropTypes.func,
  onLoopStartDrag: PropTypes.func,
  onLoopRegionDrag: PropTypes.func,
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
}

LoopRegion.defaultProps = {
  onLoopEndDrag: () => {},
  onLoopStartDrag: () => {},
  onLoopRegionDrag: () => {},
  loopStart: 0,
  loopEnd: 1,
}

export default LoopRegion
