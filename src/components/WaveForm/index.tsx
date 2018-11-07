import colorFn from 'color'
import { map } from 'ramda'
import React, { Component } from 'react'

import { COLOR_EMPHASIS, COLOR_KEYLINE } from '~/constants/style'
import { hasWindowWith } from '~/util/env'
import { cssLabeled } from '~/util/style'

const normaliseChannel = map((v: number) => (v + 0.5) * 0.5)

const classes = cssLabeled('waveForm', {
  root: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },

  canvas: {
    height: '100%',
    width: '100%',
  },
})

export interface WaveformProps {
  color?: string
  timeRegions?: number
  buffer?: AudioBuffer
}

interface WaveformState {
  height: number
  width: number
}

class WaveForm extends Component<WaveformProps, WaveformState> {
  public state = {
    height: 0,
    width: 0,
  }

  private pixelRatio: number = 1
  private canvasNode?: HTMLCanvasElement | null

  public componentDidMount() {
    this.pixelRatio = hasWindowWith([['devicePixelRatio']])
      ? window.devicePixelRatio
      : 1

    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  public shouldComponentUpdate(props: WaveformProps, state: WaveformState) {
    return (
      this.props.buffer !== props.buffer ||
      this.state.width !== state.width ||
      this.state.height !== state.height
    )
  }

  public componentDidUpdate() {
    this.updateWaveForm()
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateWaveForm)
  }

  public render() {
    return (
      <div className={classes.root}>
        <canvas className={classes.canvas} ref={el => (this.canvasNode = el)} />
      </div>
    )
  }

  private drawTempWaveform(context: CanvasRenderingContext2D) {
    const { width, height } = this.state
    context.fillRect(0, height / 2, width, 1)
  }

  private drawWaveForm(context: CanvasRenderingContext2D) {
    const { buffer } = this.props

    if (!buffer) {
      return
    }

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

  private drawTimeRegions(context: CanvasRenderingContext2D) {
    const { timeRegions = 4 } = this.props
    const { width, height } = this.state

    for (let i = 0; i < timeRegions; i += 1) {
      const x = Math.round(i * 0.25 * width)

      context.moveTo(x, 0)
      context.lineTo(x, height)
    }
    context.stroke()
  }

  private updateWaveForm = () => {
    if (!this.canvasNode) {
      return
    }

    const { width, height } = this.state
    const { color = COLOR_EMPHASIS } = this.props
    const context = this.canvasNode.getContext('2d')

    if (!context) {
      return
    }

    this.canvasNode.width = width * this.pixelRatio
    this.canvasNode.height = height * this.pixelRatio

    context.scale(this.pixelRatio, this.pixelRatio)
    context.clearRect(0, 0, width, height)
    context.fillStyle = color
    context.strokeStyle = colorFn(COLOR_KEYLINE)
      .darken(0.06)
      .hex()

    if (this.props.buffer) {
      this.drawTimeRegions(context)
      this.drawWaveForm(context)
    } else {
      this.drawTempWaveform(context)
    }
  }

  private handleResize = () => {
    this.setState(() =>
      this.canvasNode
        ? {
            height: this.canvasNode.offsetHeight,
            width: this.canvasNode.offsetWidth,
          }
        : null,
    )
  }
}

export default WaveForm
