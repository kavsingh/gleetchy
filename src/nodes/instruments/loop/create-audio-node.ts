import rafThrottle from 'raf-throttle'
import { curry } from 'ramda'

import createEq3Node from '~/nodes/audio-effects/eq3/create-audio-node'
import { GInstrumentNode } from '~/lib/g-audio-node'

import nodeType from './node-type'
import { defaultProps } from './node-props'
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

  positionProcessor: ScriptProcessorNode
  playbackBufferSource: AudioBufferSourceNode | null = null
  positionBufferSource: AudioBufferSourceNode | null = null
  throttledNotifySubscribers = rafThrottle(this.notifySubscribers)

  constructor(protected audioContext: AudioContext, initProps: Partial<Props>) {
    super(audioContext, initProps)

    this.positionProcessor = this.audioContext.createScriptProcessor(1024, 1, 1)
    this.positionProcessor.connect(this.audioContext.destination)

    this.gainNode.connect(this.eq3Node.inNode)
    this.eq3Node.connect(this.outNode)

    this.propsUpdated(this.props, this.props)
  }

  private processPositionEvent = (event: AudioProcessingEvent) => {
    const updateState = {
      ...this.playbackState,
      positionRatio: event.inputBuffer.getChannelData(0)[0],
    }

    this.throttledNotifySubscribers(updateState)
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
    this.positionBufferSource.playbackRate.value = this.playbackBufferSource.playbackRate.value = playbackRate
  }

  private removeSource() {
    try {
      this.playbackBufferSource?.disconnect(this.gainNode)
      this.positionBufferSource?.disconnect(this.positionProcessor)
    } catch {
      // noop
    }

    this.positionProcessor.onaudioprocess = null
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

    this.updateSourceProps()

    if (!this.playbackState.playing) return

    this.positionProcessor.onaudioprocess = this.processPositionEvent

    this.playbackBufferSource.connect(this.gainNode)
    this.positionBufferSource.connect(this.positionProcessor)

    this.playbackBufferSource.start(0, this.playbackBufferSource.loopStart)
    this.positionBufferSource.start(0, this.positionBufferSource.loopStart)

    this.playbackState.positionRatio = this.positionBufferSource.loopStart
  }

  protected propsUpdated(props: Props, prevProps: Props): void {
    const { gain, audioBuffer, loopStart, midGain, lowGain, highGain } = props

    this.gainNode.gain.value = gain
    this.eq3Node.set({ midGain, lowGain, highGain })

    if (
      prevProps.audioBuffer !== audioBuffer ||
      prevProps.loopStart !== loopStart
    ) {
      this.replaceSource()
    } else if (audioBuffer && this.playbackBufferSource) {
      this.updateSourceProps()
    } else if (!audioBuffer) {
      this.removeSource()
    }
  }

  play(): void {
    if (this.playbackState.playing) return

    this.playbackState.playing = true
    this.replaceSource()
  }

  stop(): void {
    if (!this.playbackState.playing) return

    this.playbackState.playing = false
    this.removeSource()
  }

  destroy(): void {
    this.stop()
    this.throttledNotifySubscribers.cancel()

    try {
      this.positionProcessor.disconnect(this.audioContext.destination)
    } catch {
      // noop
    }
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
