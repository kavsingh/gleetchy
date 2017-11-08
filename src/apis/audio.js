import { getWindow } from '~/util/env'

let audioContext

export const getAudioContext = () => {
  if (audioContext) return audioContext

  const WINDOW = getWindow()

  if (!WINDOW) throw new Error('No audio context available')

  const AudioContext = WINDOW.AudioContext || WINDOW.webkitAudioContext

  if (!AudioContext) throw new Error('No audio context available')

  audioContext = new AudioContext()

  return audioContext
}

export const decodeAudioData = (buffer, context) =>
  new Promise((resolve, reject) =>
    (context || getAudioContext()).decodeAudioData(buffer, resolve, reject),
  )
