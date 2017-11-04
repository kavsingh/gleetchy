import { getWindow } from '../util/env'

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

const decodeAudioDataP = (context, buffer) =>
  new Promise((resolve, reject) =>
    context.decodeAudioData(buffer, resolve, reject),
  )

export const decodeAudioData = (buffer, context) =>
  Promise.resolve()
    .then(() => context || getAudioContext())
    .then(ctx => decodeAudioDataP(ctx, buffer))
