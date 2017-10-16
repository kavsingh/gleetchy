import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { COLOR_EMPHASIS } from '../../constants/style'

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

    context.clearRect(0, 0, width, height)
    context.fillStyle = this.props.color

    context.fillRect(0, height / 2, width, 1)
  }

  drawWaveForm() {
    const { buffer } = this.props
    const { width, height } = this.state
    const context = this.canvasNode.getContext('2d')
    const halfHeight = height / 2
    const leftChannel = normaliseChannel(buffer.getChannelData(0))
    const rightChannel =
      buffer.numberOfChannels > 1
        ? normaliseChannel(buffer.getChannelData(1))
        : leftChannel
    const buffStep = buffer.length / width

    context.clearRect(0, 0, width, height)
    context.fillStyle = this.props.color

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
    const pixelRatio =
      typeof window === 'undefined' ? 1 : window.devicePixelRatio

    this.canvasNode.width = width * pixelRatio
    this.canvasNode.height = height * pixelRatio

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
    const pixelRatio =
      typeof window === 'undefined' ? 1 : window.devicePixelRatio
    const dim = `${100 * pixelRatio}%`

    return (
      <div className="waveForm">
        <canvas
          style={{ width: dim, height: dim }}
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
