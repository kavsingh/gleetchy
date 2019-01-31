import { getWindow } from '~/util/env'

let audioContext: AudioContext

export const getAudioContext = () => {
  if (audioContext) {
    return audioContext
  }

  const WINDOW = getWindow()

  if (!WINDOW) {
    throw new Error('No audio context available')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AudioContext = WINDOW.AudioContext || (WINDOW as any).webkitAudioContext

  if (!AudioContext) {
    throw new Error('No audio context available')
  }

  audioContext = new AudioContext()

  return audioContext
}

export const decodeAudioData = (buffer: ArrayBuffer, context?: AudioContext) =>
  new Promise<AudioBuffer>((resolve, reject) =>
    (context || getAudioContext()).decodeAudioData(buffer, resolve, reject),
  )
