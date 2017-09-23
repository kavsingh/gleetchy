import { createSlider, attachEls, bindControl } from './uiUtil'

const simpleOsc = () => {
  const audioContext = new AudioContext()
  const osc = audioContext.createOscillator()
  const osc2 = audioContext.createOscillator()
  const gain = audioContext.createGain()

  const freqControl = createSlider('osc', {
    min: 40,
    max: 440,
    step: 1,
    value: 40,
  })

  const gainControl = createSlider('gain', {
    min: 0,
    max: 1,
    step: 0.01,
    value: 0,
  })

  attachEls(document.body, [freqControl.container, gainControl.container])

  bindControl(gainControl.input, () => {
    gain.gain.value = gainControl.input.value
  })

  bindControl(freqControl.input, () => {
    osc.frequency.value = freqControl.input.value
    osc2.frequency.value = freqControl.input.value * 0.8
  })

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(audioContext.destination)

  osc.start()
  osc2.start()
}

export default simpleOsc
