import { curry, pick } from 'ramda'
import { INS_LOOPER } from '../constants/nodeTypes'
import { createEq3Node } from './eq3Node'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  gain: 1,
  loopStart: 0,
  loopEnd: 1,
  playbackRate: 1,
  audioBuffer: undefined,
  eqMid: 0,
  eqLow: 0,
  eqHigh: 0,
}

const pickProps = pick(Object.keys(defaultProps))
const pickEqProps = pick(['eqLow', 'eqMid', 'eqHigh'])

export const createLooperNode = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const eq3Node = createEq3Node(audioContext, pickEqProps(initProps))
  const gainNode = audioContext.createGain()
  const getInNode = () => gainNode
  const getOutNode = () => gainNode

  let isPlaying = false
  let bufferSourceNode = null

  eq3Node.connect(gainNode)
  gainNode.gain.value = props.gain

  const transferPropsToBufferSourceNode = () => {
    const { audioBuffer: { duration } } = props

    bufferSourceNode.loopStart = props.loopStart * duration
    bufferSourceNode.loopEnd = props.loopEnd * duration
    bufferSourceNode.playbackRate.value = props.playbackRate
  }

  const removeBufferSourceNode = () => {
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
    if (isPlaying) bufferSourceNode.start(0, loopStart * audioBuffer.duration)
  }

  return {
    type: INS_LOOPER,

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

      eq3Node.set(pickEqProps(props))
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

    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  }
})
