import { requireWindowWith } from '~/lib/env'

let audioContext: AudioContext

export const getAudioContext = () => {
  if (audioContext) {
    return audioContext
  }

  const WINDOW = requireWindowWith()

  if (!WINDOW) {
    throw new Error('Could not access dom')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const AudioContext = WINDOW.AudioContext || (WINDOW as any).webkitAudioContext

  if (!AudioContext) {
    throw new Error('No audio context available')
  }

  audioContext = new AudioContext()

  return audioContext
}
