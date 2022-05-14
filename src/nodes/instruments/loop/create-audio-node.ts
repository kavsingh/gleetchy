import rafThrottle from 'raf-throttle'
import { curry } from 'ramda'

import createEq3Node from '~/nodes/audio-effects/eq3/create-audio-node'
import { GInstrumentNode } from '~/lib/g-audio-node'

import nodeType from './node-type'
import { defaultProps } from './node-props'
// eslint-disable-next-line import/default
import processor from './processor.worklet?url'

import type { Props } from './node-props'

const createPositionBuffer = (context: AudioContext, source: AudioBuffer) => {
  const buffer = context.createBuffer(1, source.length, source.sampleRate)
  const positions = buffer.getChannelData(0)

  for (let i = 0; i < buffer.length; i++) {
    positions[i] = i / buffer.length
  }

  return buffer
}

export class GLoopNode extends GInstrumentNode<Props, PlaybackState> {
  type = nodeType
  defaultProps = defaultProps

  playbackState: PlaybackState = { playing: false, positionRatio: 0 }

  gainNode = this.audioContext.createGain()
  eq3Node = createEq3Node(this.audioContext, {
    lowGain: 0,
    midGain: 0,
    highGain: 0,
  })

  worklet: AudioWorkletNode
  playbackBufferSource: AudioBufferSourceNode | null = null
  positionBufferSource: AudioBufferSourceNode | null = null
  throttledNotifySubscribers = rafThrottle(this.notifySubscribers)

  constructor(protected audioContext: AudioContext, initProps: Partial<Props>) {
    super(audioContext, initProps)

    this.gainNode.connect(this.eq3Node.inNode)
    this.eq3Node.connect(this.outNode)
    this.worklet = new AudioWorkletNode(this.audioContext, 'loop-processor')
  }

  static override getWorklets(): Promise<string[]> {
    return Promise.resolve([processor])
  }

  play(): void {
    if (this.playbackState.playing) return

    this.playbackState.playing = true
    void this.replaceSource()
  }

  stop(): void {
    if (!this.playbackState.playing) return

    this.playbackState.playing = false
    this.removeSource()
  }

  destroy(): void {
    this.stop()
    this.throttledNotifySubscribers.cancel()
    this.worklet.port.postMessage('kill')
  }

  protected propsUpdated(props: Props, prevProps: Props): void {
    const { gain, audioBuffer, loopStart, midGain, lowGain, highGain } = props

    this.gainNode.gain.value = gain
    this.eq3Node.set({ midGain, lowGain, highGain })

    if (
      prevProps.audioBuffer !== audioBuffer ||
      prevProps.loopStart !== loopStart
    ) {
      void this.replaceSource()
    } else if (audioBuffer && this.playbackBufferSource) {
      this.updateSourceProps()
    } else if (!audioBuffer) {
      this.removeSource()
    }
  }

  private processWorkletPositionMessage = (message: MessageEvent<number>) => {
    this.throttledNotifySubscribers({
      ...this.playbackState,
      positionRatio: message.data,
    })
  }

  private updateSourceProps() {
    if (
      !this.props.audioBuffer ||
      !this.playbackBufferSource ||
      !this.positionBufferSource
    ) {
      return
    }

    const { loopStart, loopEnd, playbackRate, audioBuffer } = this.props

    this.positionBufferSource.loopStart = this.playbackBufferSource.loopStart =
      loopStart * audioBuffer.duration
    this.positionBufferSource.loopEnd = this.playbackBufferSource.loopEnd =
      loopEnd * audioBuffer.duration
    this.positionBufferSource.playbackRate.value =
      this.playbackBufferSource.playbackRate.value = playbackRate
  }

  private removeSource() {
    try {
      this.playbackBufferSource?.disconnect(this.gainNode)
      this.positionBufferSource?.disconnect(this.worklet)
    } catch (_e) {
      // noop
    }

    this.worklet.port.onmessage = null
    this.playbackBufferSource = null
    this.positionBufferSource = null
  }

  private replaceSource() {
    this.removeSource()

    const { audioBuffer } = this.props

    if (!audioBuffer) return

    this.playbackBufferSource = this.audioContext.createBufferSource()
    this.positionBufferSource = this.audioContext.createBufferSource()

    this.playbackBufferSource.buffer = audioBuffer
    this.positionBufferSource.buffer = createPositionBuffer(
      this.audioContext,
      audioBuffer,
    )

    this.positionBufferSource.loop = this.playbackBufferSource.loop = true

    this.propsUpdated(this.props, this.props)

    if (this.worklet) this.positionBufferSource.connect(this.worklet)

    this.updateSourceProps()

    if (!this.playbackState.playing) return

    if (this.worklet) {
      this.worklet.port.onmessage = this.processWorkletPositionMessage
    }

    this.playbackBufferSource.connect(this.gainNode)
    this.playbackBufferSource.start(0, this.playbackBufferSource.loopStart)
    this.positionBufferSource.start(0, this.positionBufferSource.loopStart)

    this.playbackState.positionRatio = this.positionBufferSource.loopStart
  }
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) =>
    new GLoopNode(audioContext, { ...defaultProps, ...initProps }),
)

interface PlaybackState {
  playing: boolean
  positionRatio?: number
}
