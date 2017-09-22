import { createSlider, attachEls } from './uiUtil'

const simpleOsc = () => {
  const audioContext = new AudioContext()
  const osc = audioContext.createOscillator()
  const osc2 = audioContext.createOscillator()
  const gain = audioContext.createGain()

  const [
    gainControl,
    freqControl,
  ] = attachEls(
    document.body,
    [
      createSlider({
        min: 0, max: 1, step: 0.01, value: 0,
      }),
      createSlider({
        min: 40, max: 440, step: 1, value: 40,
      }),
    ],
  )

  const updateGain = () => { gain.gain.value = gainControl.value }
  const updateOsc = () => {
    osc.frequency.value = freqControl.value
    osc2.frequency.value = freqControl.value * 0.8
  }

  updateGain()
  updateOsc()
  gainControl.addEventListener('input', updateGain)
  freqControl.addEventListener('input', updateOsc)

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(audioContext.destination)

  osc.start()
  osc2.start()
}

export default simpleOsc
