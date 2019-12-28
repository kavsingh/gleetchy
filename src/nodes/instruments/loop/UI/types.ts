import { AudioNodeConnection } from '~/types'

export interface LoopProps {
  loopStart: number
  loopEnd: number
  label: string
  fileName: string
  connections: AudioNodeConnection[]
  isActive: boolean
  highGain: number
  midGain: number
  lowGain: number
  playbackRate: number
  gain: number
  audioBuffer?: AudioBuffer
  onGainChange(gain: number): unknown
  onPlaybackRateChange(playbackRate: number): unknown
  onEqChange(props: { [key: string]: number }): unknown
  selectAudioFile(): unknown
  receiveAudioFile(file: File): unknown
  onLoopRegionChange(start: number, end: number): unknown
  onLabelChange(label: string): unknown
  remove(): unknown
}
