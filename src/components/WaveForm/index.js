import Inferno from 'inferno'
import Component from 'inferno-component'
import { map } from 'ramda'
import classNames from './WaveForm.css'

const Handle = ({ align = 'left' }) => (
  <div className={classNames.handle}>
    <div
      className={classNames.handleTag}
      style={align === 'left' ? { right: 0 } : { left: 0 }}
    />
    <div className={classNames.handleLine} />
  </div>
)

class WaveForm extends Component {
  constructor(...args) {
    super(...args)

    this.handleLoopStartDown = this.handleLoopStartDown.bind(this)
    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopStartUp = this.handleLoopStartUp.bind(this)
    this.handleLoopEndDown = this.handleLoopEndDown.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopEndUp = this.handleLoopEndUp.bind(this)
  }

  handleLoopStartDown() {
    window.addEventListener('mousemove', this.handleLoopStartDrag)
    window.addEventListener('mouseup', this.handleLoopStartUp)
  }

  handleLoopStartDrag(event) {
    this.props.onLoopStartDrag(event.movementX / this.canvasNode.width)
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
    this.props.onLoopEndDrag(event.movementX / this.canvasNode.width)
  }

  handleLoopEndUp() {
    window.removeEventListener('mouseup', this.handleLoopEndUp)
    window.removeEventListener('mousemove', this.handleLoopEndDrag)
  }

  drawWaveForm() {
    const { buffer, loopStart, loopEnd } = this.props

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

    context.fillStyle = 'rgba(255, 255, 255, 0.8)'
    context.fillRect(0, 0, width * loopStart, height)
    context.fillRect(width * loopEnd, 0, width - width * loopEnd, height)
  }

  componentDidMount() {
    this.drawWaveForm()
  }

  componentDidUpdate() {
    this.drawWaveForm()
  }

  componentWillUnmount() {
    this.handleLoopStartUp()
    this.handleLoopEndUp()
  }

  render() {
    const { width, height, loopStart, loopEnd, buffer } = this.props

    return (
      <div className={classNames.root} style={{ width, height }}>
        {buffer
          ? [
              <div
                className={classNames.handleContainer}
                ref={c => {
                  this.startHandle = c
                }}
                key="startHandle"
                style={{ width: '10px', left: loopStart * width - 5 }}
                onMouseDown={this.handleLoopStartDown}
              >
                <Handle align="left" />
              </div>,
              <div
                className={classNames.handleContainer}
                ref={c => {
                  this.endHandle = c
                }}
                key="endHandle"
                style={{ width: '10px', left: loopEnd * width - 5 }}
                onMouseDown={this.handleLoopEndDown}
              >
                <Handle align="right" />
              </div>,
            ]
          : ''}

        <canvas
          classNames={classNames.canvas}
          width={width}
          height={height}
          ref={c => {
            this.canvasNode = c
          }}
        />
      </div>
    )
  }
}

export default WaveForm
