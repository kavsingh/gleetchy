import Inferno from 'inferno'
import Component from 'inferno-component'
import WaveForm from '../WaveForm'
import PlayPauseButton from '../PlayPauseButton'
import classNames from './AudioLooper.css'

class AudioLooper extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)

    this.state = {
      buffer: null,
      isPlaying: false,
      loopStart: 0,
      loopEnd: 1,
    }

    this.bufferSourceNode = null
    this.handlePlayPause = this.handlePlayPause.bind(this)
  }

  handlePlayPause() {
    if (!this.state.buffer) return
    this.setState(state => ({ isPlaying: !state.isPlaying }))
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
    const { buffer, isPlaying, loopStart } = this.state
    const bufferChanged = prevState.buffer !== buffer
    const playChanged = isPlaying !== prevState.isPlaying

    if (buffer && (bufferChanged || playChanged)) {
      this.replaceBufferSourceNode()
      if (isPlaying) this.bufferSourceNode.start(0, loopStart)
    }
  }

  componentWillUnmount() {
    if (this.bufferSourceNode) this.props.disconnect(this.bufferSourceNode)
  }

  render() {
    const { buffer, isPlaying } = this.state

    return (
      <div className={classNames.root}>
        {buffer
          ? [
              <WaveForm
                width={600}
                height={100}
                buffer={buffer}
                key={'waveform'}
              />,
              <PlayPauseButton
                key={'button'}
                isPlaying={isPlaying}
                onClick={this.handlePlayPause}
              />,
            ]
          : 'Loading ...'}
      </div>
    )
  }
}

export default AudioLooper
