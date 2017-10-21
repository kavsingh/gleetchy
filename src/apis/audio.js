import { hasWindow } from '../util/env'

let audioContext

export const getAudioContext = () => {
  if (audioContext) return audioContext

  if (!hasWindow) throw new Error('No audio context available')

  const AudioContext = window.AudioContext || window.webkitAudioContext

  if (!AudioContext) throw new Error('No audio context available')

  audioContext = new AudioContext()

  return audioContext
}

export const getAudioContextAsync = () =>
  Promise.resolve().then(getAudioContext)

export const decodeAudioData = buffer =>
  getAudioContextAsync().then(
    context =>
      new Promise((resolve, reject) =>
        context.decodeAudioData(buffer, resolve, reject),
      ),
  )
