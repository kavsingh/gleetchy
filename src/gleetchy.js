import Inferno, { render } from 'inferno'
import Component from 'inferno-component'
import { loadAudioToBuffer } from './util'

const PlayPauseButton = ({ isPlaying = false, onClick = () => {} }) => (
  <div onClick={onClick} style={{ cursor: 'pointer' }}>
    { isPlaying ? 'Pause' : 'Play' }
  </div>
)

class AudioLooper extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)

    this.state = {
      buffer: null,
      isPlaying: false,
      loop: true,
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
    this.bufferSourceNode.buffer = this.state.buffer
    this.props.connect(this.bufferSourceNode)
  }

  componentDidMount() {
    this.props.loadAudio().then(buffer => { this.setState(() => ({ buffer })) })
  }

  componentDidUpdate(prevProps, prevState) {
    const { buffer, isPlaying } = this.state

    if (prevState.buffer !== buffer || isPlaying !== prevState.isPlaying) {
      this.replaceBufferSourceNode()
      if (isPlaying) this.bufferSourceNode.start()
    }
  }

  componentWillUnmount() {
    if (this.bufferSourceNode) this.props.disconnect(this.bufferSourceNode)
  }

  render() {
    const { buffer, isPlaying } = this.state

    return (
      buffer
        ? (
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={this.handlePlayPause}
          />
        )
        : 'Loading...'
    )
  }
}

const gleetchy = () => {
  const audioContext = new AudioContext()
  const container = document.createElement('div')

  document.body.appendChild(container)

  render(
    <AudioLooper
      createBufferSourceNode={() => audioContext.createBufferSource()}
      loadAudio={
        () => loadAudioToBuffer(audioContext, 'media/rubbishyyyyyabl.mp3')
      }
      connect={node => {
        try {
          node.connect(audioContext.destination)
        } catch (e) {
          console.warn(e)
        }
      }}
      disconnect={node => {
        try {
          node.disconnect(audioContext.destination)
        } catch (e) {
          console.warn(e)
        }
      }}
    />,
    container,
  )
}

export default gleetchy
