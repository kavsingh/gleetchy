import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import classNames from './WaveForm.css'

const normaliseChannel = map(v => (v + 0.5) * 0.5)

class WaveForm extends Component {
  constructor(...args) {
    super(...args)

    this.state = { width: 0, height: 0 }

    this.handleResize = this.handleResize.bind(this)
    this.updateWaveForm = this.updateWaveForm.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  shouldComponentUpdate(props, state) {
    return (
      this.props.buffer !== props.buffer ||
      this.state.width !== state.width ||
      this.state.height !== state.height
    )
  }

  componentDidUpdate() {
    this.updateWaveForm()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWaveForm)
  }

  drawTempWaveform() {
    const { width, height } = this.state
    const context = this.canvasNode.getContext('2d')

    this.canvasNode.width = width
    this.canvasNode.height = height

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#000'

    context.fillRect(0, height / 2, width, 1)
  }

  drawWaveForm() {
    const { buffer } = this.props
    const { width, height } = this.state

    this.canvasNode.width = width
    this.canvasNode.height = height

    const context = this.canvasNode.getContext('2d')
    const halfHeight = height / 2
    const leftChannel = normaliseChannel(buffer.getChannelData(0))
    const rightChannel =
      buffer.numberOfChannels > 1
        ? normaliseChannel(buffer.getChannelData(1))
        : leftChannel
    const buffStep = buffer.length / width

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#000'

    for (let i = 0; i < width; i += 1) {
      const index = Math.floor(i * buffStep)
      const leftVal = leftChannel[index] * halfHeight
      const rightVal = rightChannel[index] * halfHeight

      context.fillRect(i, halfHeight - leftVal, 1, leftVal + rightVal)
    }
  }

  updateWaveForm() {
    if (!this.canvasNode) return

    if (this.props.buffer) this.drawWaveForm()
    else this.drawTempWaveform()
  }

  handleResize() {
    this.setState(() => ({
      width: this.canvasNode.offsetWidth,
      height: this.canvasNode.offsetHeight,
    }))
  }

  render() {
    return (
      <canvas
        className={classNames.root}
        ref={c => {
          this.canvasNode = c
        }}
      />
    )
  }
}

WaveForm.propTypes = {
  buffer: PropTypes.instanceOf(AudioBuffer),
}

WaveForm.defaultProps = {
  buffer: undefined,
}

export default WaveForm
