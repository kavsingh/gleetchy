import Inferno from 'inferno'
import Component from 'inferno-component'
import { map } from 'ramda'
import classNames from './WaveForm.css'

const normaliseChannel = map(v => (v + 0.5) * 0.5)

class WaveForm extends Component {
  drawWaveForm() {
    const { buffer } = this.props

    if (!buffer || !this.canvasNode) return

    const context = this.canvasNode.getContext('2d')
    const { offsetWidth: width, offsetHeight: height } = this.canvasNode
    const halfHeight = height / 2
    const leftChannel = normaliseChannel(buffer.getChannelData(0))
    const rightChannel = normaliseChannel(buffer.getChannelData(1))
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
    const { offsetWidth, offsetHeight } = this.canvasNode

    this.canvasNode.width = offsetWidth
    this.canvasNode.height = offsetHeight

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
        ref={c => {
          this.canvasNode = c
        }}
      />
    )
  }
}

export default WaveForm
