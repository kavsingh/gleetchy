import Inferno from 'inferno'
import Component from 'inferno-component'
import { map } from 'ramda'

class WaveForm extends Component {
  drawWaveForm() {
    if (!this.canvasNode) return

    const { buffer } = this.props
    const context = this.canvasNode.getContext('2d')
    const { width, height } = this.canvasNode
    const halfHeight = height / 2
    const normalise = map(v => (v + 0.5) * 0.5)
    const leftChannel = normalise(buffer.getChannelData(0))
    const rightChannel = normalise(buffer.getChannelData(1))
    const buffStep = buffer.length / width

    context.fillStyle = '#FFF'
    context.fillRect(0, 0, width, height)
    context.fillStyle = '#000'

    for (let i = 0; i < width; i += 1) {
      const index = Math.floor(i * buffStep)
      const leftVal = leftChannel[index] * halfHeight
      const rightVal = rightChannel[index] * halfHeight

      context.fillRect(i, halfHeight - leftVal, 1, leftVal + rightVal)
    }
  }

  componentDidMount() {
    this.drawWaveForm()
  }

  componentDidUpdate() {
    this.drawWaveForm()
  }

  render() {
    const { width, height, buffer } = this.props

    return buffer ? (
      <div>
        <canvas
          width={width}
          height={height}
          ref={c => {
            this.canvasNode = c
          }}
        />
      </div>
    ) : (
      <div />
    )
  }
}

export default WaveForm
