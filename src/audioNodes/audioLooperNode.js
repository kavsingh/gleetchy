import { curry, pick } from 'ramda'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  gain: 1,
  loopStart: 0,
  loopEnd: 1,
  playbackRate: 1,
  audioBuffer: undefined,
}

const pickProps = pick(Object.keys(defaultProps))

export const createAudioLooperNode = curry((context, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const gainNode = context.createGain()

  let isPlaying = false
  let bufferSourceNode = null

  gainNode.gain.value = props.gain

  const transferPropsToBufferSourceNode = () => {
    const { audioBuffer: { duration } } = props

    bufferSourceNode.loopStart = props.loopStart * duration
    bufferSourceNode.loopEnd = props.loopEnd * duration
    bufferSourceNode.playbackRate.value = props.playbackRate
  }

  const removeBufferSourceNode = () => {
    if (!bufferSourceNode) return

    bufferSourceNode.disconnect(gainNode)
    bufferSourceNode = null
  }

  const replaceBufferSourceNode = () => {
    removeBufferSourceNode()

    const { loopStart, audioBuffer } = props

    if (!audioBuffer) return

    bufferSourceNode = context.createBufferSource()
    bufferSourceNode.buffer = audioBuffer
    bufferSourceNode.loop = true

    transferPropsToBufferSourceNode()

    bufferSourceNode.connect(gainNode)
    if (isPlaying) bufferSourceNode.start(0, loopStart * audioBuffer.duration)
  }

  return {
    play() {
      if (isPlaying) return

      isPlaying = true
      replaceBufferSourceNode()
    },

    stop() {
      if (!isPlaying) return

      isPlaying = false
      removeBufferSourceNode()
    },

    set(newProps = {}) {
      const prevProps = { ...props }

      Object.assign(props, pickProps(newProps))

      const { gain, audioBuffer, loopStart } = props

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

    getInNode() {
      return gainNode
    },

    getOutNode() {
      return gainNode
    },

    connect: createConnect(() => gainNode),

    disconnect: createDisconnect(() => gainNode),
  }
})
