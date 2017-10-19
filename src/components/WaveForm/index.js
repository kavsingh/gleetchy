import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { COLOR_EMPHASIS } from '../../constants/style'
import { hasWindowWith } from '../../util/env'

const normaliseChannel = map(v => (v + 0.5) * 0.5)

class WaveForm extends Component {
  constructor(...args) {
    super(...args)

    this.state = { width: 0, height: 0 }

    this.handleResize = this.handleResize.bind(this)
    this.updateWaveForm = this.updateWaveForm.bind(this)
  }

  componentDidMount() {
    this.pixelRatio = hasWindowWith([['devicePixelRatio']])
      ? window.devicePixelRatio
      : 1

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

  drawTempWaveform(context) {
    const { width, height } = this.state
    context.fillRect(0, height / 2, width, 1)
  }

  drawWaveForm(context) {
    const { buffer } = this.props
    const { width, height } = this.state

    const halfHeight = height / 2
    const leftChannel = normaliseChannel(buffer.getChannelData(0))
    const rightChannel =
      buffer.numberOfChannels > 1
        ? normaliseChannel(buffer.getChannelData(1))
        : leftChannel
    const buffStep = buffer.length / width

    for (let i = 0; i < width; i += 1) {
      const index = Math.floor(i * buffStep)
      const leftVal = leftChannel[index] * halfHeight
      const rightVal = rightChannel[index] * halfHeight

      context.fillRect(i, halfHeight - leftVal, 1, leftVal + rightVal)
    }
  }

  updateWaveForm() {
    if (!this.canvasNode) return

    const { width, height } = this.state
    const { color } = this.props
    const context = this.canvasNode.getContext('2d')

    this.canvasNode.width = width * this.pixelRatio
    this.canvasNode.height = height * this.pixelRatio

    context.scale(this.pixelRatio, this.pixelRatio)
    context.clearRect(0, 0, width, height)
    context.fillStyle = color

    if (this.props.buffer) this.drawWaveForm(context)
    else this.drawTempWaveform(context)
  }

  handleResize() {
    this.setState(() => ({
      width: this.canvasNode.offsetWidth,
      height: this.canvasNode.offsetHeight,
    }))
  }

  render() {
    return (
      <div className="waveForm">
        <canvas
          className="waveForm__canvas"
          ref={c => {
            this.canvasNode = c
          }}
        />
        <style jsx>{`
          .waveForm,
          .waveForm__canvas {
            width: 100%;
            height: 100%;
          }

          .waveForm {
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

WaveForm.propTypes = {
  color: PropTypes.string,
  buffer: PropTypes.instanceOf(AudioBuffer),
}

WaveForm.defaultProps = {
  color: COLOR_EMPHASIS,
  buffer: undefined,
}

export default WaveForm
