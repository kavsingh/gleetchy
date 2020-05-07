import { always, curry } from 'ramda'

import { makeConnectable } from '~/lib/connection'
import createEq3Node from '~/nodes/audio-effects/eq3/create-audio-node'
import type { GInstrumentNode } from '~/types'

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

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) => {
    const props = { ...defaultProps, ...initProps }
    const eq3Node = createEq3Node(audioContext, {
      lowGain: props.lowGain,
      midGain: props.midGain,
      highGain: props.highGain,
    })
    const gainNode = audioContext.createGain()
    const getGainNode = always(gainNode)
    const subscribers: PlaybackStateSubscriber[] = []
    const playbackState: PlaybackState = { playing: false, positionRatio: 0 }

    let bufferSourceNode: AudioBufferSourceNode | null = null
    let positionBufferSourceNode: AudioBufferSourceNode | null = null

    const positionBufferProcessor = audioContext.createScriptProcessor(
      2048,
      1,
      1,
    )

    eq3Node.connect(gainNode)
    positionBufferProcessor.connect(audioContext.destination)
    gainNode.gain.value = props.gain

    const transferPropsToBufferSourceNode = () => {
      if (!bufferSourceNode || !positionBufferSourceNode) return

      const { audioBuffer } = props

      if (!audioBuffer) return

      const { duration } = audioBuffer

      bufferSourceNode.loopStart = props.loopStart * duration
      bufferSourceNode.loopEnd = props.loopEnd * duration
      bufferSourceNode.playbackRate.value = props.playbackRate
      positionBufferSourceNode.loopStart = bufferSourceNode.loopStart
      positionBufferSourceNode.loopEnd = bufferSourceNode.loopEnd
      positionBufferSourceNode.playbackRate.value =
        bufferSourceNode.playbackRate.value

      return bufferSourceNode
    }

    const processScriptEvent = (event: AudioProcessingEvent) => {
      subscribers.forEach((subscriber) => {
        subscriber({
          playing: true,
          positionRatio: event.inputBuffer.getChannelData(0)[0],
        })
      })
    }

    const removeBufferSourceNode = () => {
      try {
        bufferSourceNode?.disconnect(eq3Node.getInNode())
        positionBufferSourceNode?.disconnect(positionBufferProcessor)
      } catch {
        // noop
      }
      positionBufferProcessor.onaudioprocess = null
      bufferSourceNode = null
      positionBufferSourceNode = null
    }

    const replaceBufferSourceNode = () => {
      removeBufferSourceNode()

      const { loopStart, audioBuffer } = props

      if (!audioBuffer) return

      bufferSourceNode = audioContext.createBufferSource()
      bufferSourceNode.buffer = audioBuffer
      bufferSourceNode.loop = true
      positionBufferSourceNode = audioContext.createBufferSource()
      positionBufferSourceNode.buffer = createPositionBuffer(
        audioContext,
        audioBuffer,
      )
      positionBufferSourceNode.loop = bufferSourceNode.loop

      transferPropsToBufferSourceNode()

      if (!playbackState.playing) return

      positionBufferProcessor.onaudioprocess = processScriptEvent

      bufferSourceNode.connect(eq3Node.getInNode())
      positionBufferSourceNode.connect(positionBufferProcessor)

      bufferSourceNode.start(0, bufferSourceNode.loopStart)
      positionBufferSourceNode.start(0, positionBufferSourceNode.loopStart)

      playbackState.positionRatio = loopStart
    }

    return makeConnectable<
      GInstrumentNode<Props, typeof nodeType, PlaybackStateSubscriber>
    >({
      getInNode: getGainNode,
      getOutNode: getGainNode,
    })({
      type: nodeType,

      play() {
        if (playbackState.playing) return

        playbackState.playing = true
        replaceBufferSourceNode()
      },

      stop() {
        if (!playbackState.playing) return

        playbackState.playing = false
        removeBufferSourceNode()
      },

      set(newProps: Partial<Props> = {}) {
        const prevProps = { ...props }

        Object.assign(props, newProps)

        const {
          gain,
          audioBuffer,
          loopStart,
          midGain,
          lowGain,
          highGain,
        } = props

        eq3Node.set({ midGain, lowGain, highGain })
        gainNode.gain.value = gain

        if (
          prevProps.audioBuffer !== audioBuffer ||
          prevProps.loopStart !== loopStart
        ) {
          replaceBufferSourceNode()
        } else if (audioBuffer && bufferSourceNode) {
          transferPropsToBufferSourceNode()
        } else if (!audioBuffer) {
          removeBufferSourceNode()
        }
      },

      subscribe(subscriber: PlaybackStateSubscriber) {
        if (!subscribers.includes(subscriber)) subscribers.push(subscriber)

        return () => {
          const subscriberIndex = subscribers.indexOf(subscriber)

          if (subscriberIndex !== -1) subscribers.splice(subscriberIndex, 1)
        }
      },
    })
  },
)

interface PlaybackState {
  playing: boolean
  positionRatio?: number
}

type PlaybackStateSubscriber = (state: PlaybackState) => unknown
