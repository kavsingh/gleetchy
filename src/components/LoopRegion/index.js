import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from './LoopRegion.css'

const Handle = ({ align = 'left' }) => (
  <div className={classNames.handle}>
    <div
      className={classNames.handleTag}
      style={align === 'left' ? { right: 0 } : { left: 0 }}
    />
    <div className={classNames.handleLine} />
  </div>
)

Handle.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
}

Handle.defaultProps = {
  align: 'left',
}

class LoopRegion extends Component {
  constructor(...args) {
    super(...args)

    this.handleLoopStartDown = this.handleLoopStartDown.bind(this)
    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopStartUp = this.handleLoopStartUp.bind(this)
    this.handleLoopEndDown = this.handleLoopEndDown.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopEndUp = this.handleLoopEndUp.bind(this)
    this.handleActiveRegionDown = this.handleActiveRegionDown.bind(this)
    this.handleActiveRegionDrag = this.handleActiveRegionDrag.bind(this)
    this.handleActiveRegionUp = this.handleActiveRegionUp.bind(this)
  }

  componentWillUnmount() {
    this.handleLoopStartUp()
    this.handleLoopEndUp()
    this.handleActiveRegionUp()
  }

  handleLoopStartDown() {
    window.addEventListener('mousemove', this.handleLoopStartDrag)
    window.addEventListener('mouseup', this.handleLoopStartUp)
  }

  handleLoopStartDrag(event) {
    this.props.onLoopStartDrag(event.movementX / this.rootNode.offsetWidth)
  }

  handleLoopStartUp() {
    window.removeEventListener('mouseup', this.handleLoopStartUp)
    window.removeEventListener('mousemove', this.handleLoopStartDrag)
  }

  handleLoopEndDown() {
    window.addEventListener('mousemove', this.handleLoopEndDrag)
    window.addEventListener('mouseup', this.handleLoopEndUp)
  }

  handleLoopEndDrag(event) {
    this.props.onLoopEndDrag(event.movementX / this.rootNode.offsetWidth)
  }

  handleLoopEndUp() {
    window.removeEventListener('mouseup', this.handleLoopEndUp)
    window.removeEventListener('mousemove', this.handleLoopEndDrag)
  }

  handleActiveRegionDown() {
    window.addEventListener('mousemove', this.handleActiveRegionDrag)
    window.addEventListener('mouseup', this.handleActiveRegionUp)
  }

  handleActiveRegionDrag({ movementX }) {
    this.props.onLoopRegionDrag(movementX / this.rootNode.offsetWidth)
  }

  handleActiveRegionUp() {
    window.removeEventListener('mousemove', this.handleActiveRegionDrag)
    window.removeEventListener('mouseup', this.handleActiveRegionUp)
  }

  render() {
    const { loopStart, loopEnd } = this.props

    return (
      <div
        className={classNames.root}
        ref={c => {
          this.rootNode = c
        }}
      >
        <div
          role="presentation"
          className={classNames.handleContainer}
          style={{ left: `${loopStart * 100}%` }}
          onMouseDown={this.handleLoopStartDown}
        >
          <Handle align="left" />
        </div>
        <div
          role="presentation"
          className={classNames.handleContainer}
          style={{ left: `${loopEnd * 100}%` }}
          onMouseDown={this.handleLoopEndDown}
        >
          <Handle align="right" />
        </div>
        <div className={classNames.regionsContainer}>
          <div
            className={classNames.inactiveRegion}
            style={{ left: 0, right: `${(1 - loopStart) * 100}%` }}
          />
          <div
            role="presentation"
            className={classNames.activeRegion}
            onMouseDown={this.handleActiveRegionDown}
            style={{
              left: `${loopStart * 100}%`,
              right: `${(1 - loopEnd) * 100}%`,
            }}
          />
          <div
            className={classNames.inactiveRegion}
            style={{ left: `${loopEnd * 100}%`, right: 0 }}
          />
        </div>
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
