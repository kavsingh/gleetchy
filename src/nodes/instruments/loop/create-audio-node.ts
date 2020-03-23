import { always, curry } from 'ramda'

import { GInstrumentNode } from '~/types'
import { makeConnectable } from '~/lib/connection'
import createEq3Node from '~/nodes/audio-effects/eq3/create-audio-node'
import { isFiniteNumber } from '~/lib/util/predicate'

import { defaultProps, Props } from './node-props'
import nodeType from './node-type'

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
    const playbackState: PlaybackState = { playing: false }

    let bufferSourceNode: AudioBufferSourceNode | null = null
    let playbackTrackInterval: NodeJS.Timer | null = null

    eq3Node.connect(gainNode)
    gainNode.gain.value = props.gain

    const transferPropsToBufferSourceNode = () => {
      if (!bufferSourceNode) return

      const { audioBuffer } = props

      if (!audioBuffer) return

      const { duration } = audioBuffer

      bufferSourceNode.loopStart = props.loopStart * duration
      bufferSourceNode.loopEnd = props.loopEnd * duration
      bufferSourceNode.playbackRate.value = props.playbackRate

      return bufferSourceNode
    }

    const trackPlaybackOnInterval = () => {
      if (
        !props.audioBuffer ||
        !bufferSourceNode ||
        !isFiniteNumber(playbackState.ctxTimestamp) ||
        !isFiniteNumber(playbackState.position)
      ) {
        return
      }

      const current = audioContext.currentTime
      const elapsed = current - playbackState.ctxTimestamp
      const delta = elapsed * props.playbackRate
      let nextPosition = playbackState.position + delta

      if (
        nextPosition > bufferSourceNode.loopEnd ||
        nextPosition < bufferSourceNode.loopStart
      ) {
        nextPosition = bufferSourceNode.loopStart
      }

      playbackState.position = nextPosition
      playbackState.positionRatio =
        playbackState.position / props.audioBuffer.duration
      playbackState.ctxTimestamp = current

      subscribers.forEach((subscriber) => {
        subscriber({ ...playbackState })
      })
    }

    const removeBufferSourceNode = () => {
      if (playbackTrackInterval) {
        clearTimeout(playbackTrackInterval)
        playbackTrackInterval = null
      }

      if (!bufferSourceNode) return

      bufferSourceNode.disconnect(eq3Node.getInNode())
      bufferSourceNode = null
    }

    const replaceBufferSourceNode = () => {
      removeBufferSourceNode()

      const { loopStart, audioBuffer } = props

      if (!audioBuffer) return

      bufferSourceNode = audioContext.createBufferSource()
      bufferSourceNode.buffer = audioBuffer
      bufferSourceNode.loop = true

      transferPropsToBufferSourceNode()

      bufferSourceNode.connect(eq3Node.getInNode())

      if (!playbackState.playing) return

      bufferSourceNode.start(0, bufferSourceNode.loopStart)
      playbackState.ctxTimestamp = audioContext.currentTime
      playbackState.position = bufferSourceNode.loopStart
      playbackState.positionRatio = loopStart

      playbackTrackInterval = setInterval(trackPlaybackOnInterval, 20)
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
  position?: number
  positionRatio?: number
  ctxTimestamp?: number
}

type PlaybackStateSubscriber = (state: PlaybackState) => unknown
