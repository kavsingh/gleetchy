import { always, curry } from 'ramda'

import createEq3Node from '~/nodes/audioEffects/eq3/createAudioNode'
import { InstrumentNode } from '~/types'
import { connectable } from '~/util/connection'

import { defaultProps, Props } from './nodeProps'
import nodeType from './nodeType'

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>): InstrumentNode => {
    const props = { ...defaultProps, ...initProps }
    const eq3Node = createEq3Node(audioContext, {
      lowGain: props.lowGain,
      midGain: props.midGain,
      highGain: props.highGain,
    })
    const gainNode = audioContext.createGain()
    const getGainNode = always(gainNode)

    let isPlaying = false
    let bufferSourceNode: AudioBufferSourceNode | null = null

    eq3Node.connect(gainNode)
    gainNode.gain.value = props.gain

    const transferPropsToBufferSourceNode = () => {
      if (!bufferSourceNode) {
        return
      }

      const { audioBuffer } = props

      if (!audioBuffer) {
        return
      }

      const { duration } = audioBuffer

      bufferSourceNode.loopStart = props.loopStart * duration
      bufferSourceNode.loopEnd = props.loopEnd * duration
      bufferSourceNode.playbackRate.value = props.playbackRate
    }

    const removeBufferSourceNode = () => {
      if (!bufferSourceNode) {
        return
      }

      bufferSourceNode.disconnect(eq3Node.getInNode())
      bufferSourceNode = null
    }

    const replaceBufferSourceNode = () => {
      removeBufferSourceNode()

      const { loopStart, audioBuffer } = props

      if (!audioBuffer) {
        return
      }

      bufferSourceNode = audioContext.createBufferSource()
      bufferSourceNode.buffer = audioBuffer
      bufferSourceNode.loop = true

      transferPropsToBufferSourceNode()

      bufferSourceNode.connect(eq3Node.getInNode())

      if (isPlaying) {
        bufferSourceNode.start(0, loopStart * audioBuffer.duration)
      }
    }

    return connectable<Props, InstrumentNode>({
      getInNode: getGainNode,
      getOutNode: getGainNode,
    })({
      type: nodeType,

      play() {
        if (isPlaying) {
          return
        }

        isPlaying = true
        replaceBufferSourceNode()
      },

      stop() {
        if (!isPlaying) {
          return
        }

        isPlaying = false
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
    })
  },
)
