import Inferno, { render } from 'inferno'
import { tryCatch } from 'ramda'
import { warn, loadAudioToBuffer } from './util'
import AudioLooper from './components/AudioLooper'

const gleetchy = () => {
  const context = new AudioContext()
  const out = context.destination
  const connectOut = tryCatch(node => node.connect(out), warn)
  const disconnectOut = tryCatch(node => node.disconnect(out), warn)
  const container = document.createElement('div')

  document.body.appendChild(container)

  render(
    <AudioLooper
      createBufferSourceNode={() => context.createBufferSource()}
      loadAudio={() => loadAudioToBuffer(context, 'media/okthenalright4.mp3')}
      connect={connectOut}
      disconnect={disconnectOut}
    />,
    container,
  )
}

export default gleetchy
