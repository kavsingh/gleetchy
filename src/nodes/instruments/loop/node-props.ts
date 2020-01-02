import { defaultProps as eq3DefaultProps } from '~/nodes/audio-effects/eq3/node-props'

export const defaultProps = Object.freeze({
  ...eq3DefaultProps,
  audioBuffer: undefined,
  fileName: '',
  fileType: '',
  gain: 0.5,
  loopEnd: 1,
  loopStart: 0,
  playbackRate: 1,
})

export interface Props
  extends Mutable<Omit<typeof defaultProps, 'audioBuffer'>> {
  audioBuffer: AudioBuffer | undefined
}
