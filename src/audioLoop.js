import { curry } from 'ramda'
import { createSlider, attachEls, bindControl } from './uiUtil'

const loadSample = url =>
  fetch(url).then(response => response.arrayBuffer())

const decodeAudioDataP = (audioContext, buffer) =>
  new Promise((resolve, reject) =>
    audioContext.decodeAudioData(buffer, resolve, reject))

const loadAudioToBuffer = curry(async (audioContext, url) => {
  const buffer = await loadSample(url)
  return decodeAudioDataP(audioContext, buffer)
})

const audioLoop = async () => {
  const audioContext = new AudioContext()
  const bufferSource = audioContext.createBufferSource()
  const gain = audioContext.createGain()
  const gainControl = createSlider(
    'gain',
    {
      min: 0, max: 1, step: 0.01, value: 0.4,
    },
  )
  const detuneControl = createSlider(
    'detune',
    {
      min: -1200, max: 1200, step: 1, value: 0,
    },
  )

  attachEls(document.body, [gainControl.container, detuneControl.container])
  bindControl(gainControl.input, () => {
    gain.gain.value = gainControl.input.value
  })
  bindControl(detuneControl.input, () => {
    bufferSource.detune.value = detuneControl.input.value
  })

  bufferSource.buffer = await loadAudioToBuffer(audioContext, 'media/rubbishyyyyyabl.mp3')
  bufferSource.connect(gain)
  gain.connect(audioContext.destination)

  bufferSource.loop = true
  bufferSource.start()
}

export default audioLoop
