import Inferno from 'inferno'
import Component from 'inferno-component'
import { clamp } from 'ramda'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'
import classNames from './AudioLooper.css'

class AudioLooper extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)

    this.state = {
      buffer: null,
      loopStart: 0,
      loopEnd: 1,
      gain: 0.8,
    }

    this.bufferSourceNode = null
    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
  }

  handleLoopStartDrag(movement) {
    this.setState(state => ({
      loopStart: clamp(0, state.loopEnd - 0.0001, state.loopStart + movement),
    }))
  }

  handleLoopEndDrag(movement) {
    this.setState(state => ({
      loopEnd: clamp(state.loopStart + 0.0001, 1, state.loopEnd + movement),
    }))
  }

  handleLoopRegionDrag(movement) {
    this.setState(({ loopStart, loopEnd }) => {
      const gap = loopEnd - loopStart

      let nextStart
      let nextEnd

      if (movement < 0) {
        nextStart = clamp(0, 1 - gap, loopStart + movement)
        nextEnd = nextStart + gap
      } else {
        nextEnd = clamp(gap, 1, loopEnd + movement)
        nextStart = nextEnd - gap
      }

      return { loopStart: nextStart, loopEnd: nextEnd }
    })
  }

  replaceBufferSourceNode() {
    if (this.bufferSourceNode) {
      this.props.disconnect(this.bufferSourceNode)
      this.bufferSourceNode = null
    }

    this.bufferSourceNode = this.props.createBufferSourceNode()

    const { loopStart, loopEnd, buffer } = this.state

    Object.assign(this.bufferSourceNode, {
      buffer,
      loop: true,
      loopStart: loopStart * buffer.duration,
      loopEnd: loopEnd * buffer.duration,
    })

    this.props.connect(this.bufferSourceNode)
  }

  componentDidMount() {
    this.props.loadAudio().then(buffer => {
      this.setState(() => ({ buffer }))
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { isPlaying } = this.props
    const { buffer, loopStart, loopEnd } = this.state
    const playChanged = isPlaying !== prevProps.isPlaying
    const bufferChanged = prevState.buffer !== buffer
    const startChanged = loopStart !== prevState.loopStart

    if (buffer) {
      if (bufferChanged || playChanged || startChanged) {
        this.replaceBufferSourceNode()

        if (isPlaying) {
          this.bufferSourceNode.start(0, loopStart * buffer.duration)
        }
      } else {
        Object.assign(this.bufferSourceNode, {
          loopStart: loopStart * buffer.duration,
          loopEnd: loopEnd * buffer.duration,
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.bufferSourceNode) this.props.disconnect(this.bufferSourceNode)
  }

  render() {
    const { buffer, loopEnd, loopStart } = this.state

    return (
      <div className={classNames.root}>
        <div className={classNames.waveContainer}>
          <div className={classNames.waveFormContainer}>
            <WaveForm buffer={buffer} width={600} height={100} />
          </div>
          {buffer ? (
            <div className={classNames.loopRegionContainer}>
              <LoopRegion
                width={600}
                height={100}
                loopStart={loopStart}
                loopEnd={loopEnd}
                onLoopStartDrag={this.handleLoopStartDrag}
                onLoopEndDrag={this.handleLoopEndDrag}
                onLoopRegionDrag={this.handleLoopRegionDrag}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}

export default AudioLooper
