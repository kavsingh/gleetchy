import Inferno, { render } from 'inferno'
import Component from 'inferno-component'
import { tryCatch } from 'ramda'
import { warn, loadAudioToBuffer } from './util'
import PlayPauseButton from './components/PlayPauseButton'
import AudioLooper from './components/AudioLooper'

class Gleetchy extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      isPlaying: false,
    }

    const context = new AudioContext()
    const out = context.destination

    this.handlePlayPause = this.handlePlayPause.bind(this)
    this.loadAudioToBuffer = loadAudioToBuffer(context)
    this.connectOut = tryCatch(node => node.connect(out), warn)
    this.disconnectOut = tryCatch(node => node.disconnect(out), warn)
    this.createBufferSourceNode = tryCatch(
      () => context.createBufferSource(),
      warn,
    )
  }

  handlePlayPause() {
    this.setState(state => ({ isPlaying: !state.isPlaying }))
  }

  render() {
    return (
      <div>
        <AudioLooper
          createBufferSourceNode={this.createBufferSourceNode}
          loadAudio={() => this.loadAudioToBuffer('media/okthenalright4.mp3')}
          connect={this.connectOut}
          disconnect={this.disconnectOut}
          isPlaying={this.state.isPlaying}
        />
        <PlayPauseButton
          isPlaying={this.state.isPlaying}
          onClick={this.handlePlayPause}
        />
      </div>
    )
  }
}

const gleetchy = () => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  render(<Gleetchy />, container)
}

export default gleetchy
