import Inferno from 'inferno'
import Component from 'inferno-component'
import { clamp } from 'ramda'
import Slider from '../Slider'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'
import classNames from './AudioLooper.css'

class AudioLooper extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)

    this.state = {
      buffer: null,
      loopStart: props.loopStart || 0,
      loopEnd: props.loopEnd || 1,
      gain: props.gain || 0,
      playbackRate: props.playbackRate || 1,
    }

    this.bufferSourceNode = null
    this.gainNode = this.props.createGainNode()

    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
    this.handleGainChange = this.handleGainChange.bind(this)
    this.handleRateChange = this.handleRateChange.bind(this)

    this.gainNode.gain.value = this.state.gain

    this.props.connect(this.gainNode)
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

  handleGainChange(gain) {
    this.setState(() => ({ gain }))
  }

  handleRateChange(playbackRate) {
    this.setState(() => ({ playbackRate }))
  }

  replaceBufferSourceNode() {
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect(this.gainNode)
      this.bufferSourceNode = null
    }

    this.bufferSourceNode = this.props.createBufferSourceNode()

    const { loopStart, loopEnd, buffer, playbackRate } = this.state

    this.bufferSourceNode.buffer = buffer
    this.bufferSourceNode.loop = true
    this.bufferSourceNode.loopStart = loopStart * buffer.duration
    this.bufferSourceNode.loopEnd = loopEnd * buffer.duration
    this.bufferSourceNode.playbackRate.value = playbackRate

    this.bufferSourceNode.connect(this.gainNode)
  }

  componentDidMount() {
    this.props.loadAudio().then(buffer => {
      this.setState(() => ({ buffer }))
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { isPlaying } = this.props
    const { buffer, loopStart, loopEnd, gain, playbackRate } = this.state
    const playChanged = isPlaying !== prevProps.isPlaying
    const bufferChanged = prevState.buffer !== buffer
    const startChanged = loopStart !== prevState.loopStart

    this.gainNode.gain.value = gain

    if (buffer) {
      if (bufferChanged || playChanged || startChanged) {
        this.replaceBufferSourceNode()

        if (isPlaying) {
          this.bufferSourceNode.start(0, loopStart * buffer.duration)
        }
      } else {
        this.bufferSourceNode.loopStart = loopStart * buffer.duration
        this.bufferSourceNode.loopEnd = loopEnd * buffer.duration
        this.bufferSourceNode.playbackRate.value = playbackRate
      }
    }
  }

  componentWillUnmount() {
    if (this.bufferSourceNode) this.props.disconnect(this.bufferSourceNode)
  }

  render() {
    const { buffer, loopEnd, loopStart, gain, playbackRate } = this.state

    return (
      <div className={classNames.root}>
        <div className={classNames.waveContainer}>
          <div className={classNames.waveFormContainer}>
            <WaveForm buffer={buffer} />
          </div>
          {buffer ? (
            <div className={classNames.loopRegionContainer}>
              <LoopRegion
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
        <div className={classNames.gainSliderContainer}>
          <Slider
            value={gain}
            renderLabel={() => 'G'}
            renderValue={() => gain.toFixed(2)}
            onChange={this.handleGainChange}
          />
        </div>
        <div className={classNames.rateSliderContainer}>
          <Slider
            value={playbackRate}
            renderLabel={() => 'S'}
            renderValue={() => playbackRate.toFixed(2)}
            onChange={this.handleRateChange}
          />
        </div>
      </div>
    )
  }
}

export default AudioLooper
