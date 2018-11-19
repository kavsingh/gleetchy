import eq3Props from '~/nodes/audioEffects/eq3/nodeProps'

type Eq3NodeProps = typeof eq3Props
interface NodeProps extends Eq3NodeProps {
  audioBuffer?: AudioBuffer
  fileName: string
  fileType: string
  gain: number
  loopEnd: number
  loopStart: number
  playbackRate: number
}

export default Object.freeze({
  ...eq3Props,
  audioBuffer: undefined,
  fileName: '',
  fileType: '',
  gain: 0.5,
  loopEnd: 1,
  loopStart: 0,
  playbackRate: 1,
} as NodeProps)
