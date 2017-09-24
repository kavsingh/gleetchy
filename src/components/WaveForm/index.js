import Inferno from 'inferno'
import Component from 'inferno-component'
import { map } from 'ramda'
import classNames from './WaveForm.css'

class WaveForm extends Component {
  drawWaveForm() {
    const { buffer } = this.props

    if (!buffer) return

    const context = this.canvasNode.getContext('2d')
    const { width, height } = this.canvasNode
    const halfHeight = height / 2
    const normalise = map(v => (v + 0.5) * 0.5)
    const leftChannel = normalise(buffer.getChannelData(0))
    const rightChannel = normalise(buffer.getChannelData(1))
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

  componentDidMount() {
    this.drawWaveForm()
  }

  shouldComponentUpdate(props) {
    return this.props.buffer !== props.buffer
  }

  componentDidUpdate() {
    this.drawWaveForm()
  }

  render() {
    return (
      <canvas
        className={classNames.root}
        width={this.props.width}
        height={this.props.height}
        ref={c => {
          this.canvasNode = c
        }}
      />
    )
  }
}

export default WaveForm
