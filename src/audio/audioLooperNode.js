import { curry, pick } from 'ramda'

const defaultProps = {
  gain: 1,
  loopStart: 0,
  loopEnd: 1,
  playbackRate: 1,
  buffer: undefined,
}

const pickProps = pick(Object.keys(defaultProps))

export const createAudioLooperNode = curry((context, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const gainNode = context.createGain()

  let isPlaying = false
  let bufferSourceNode = null

  gainNode.gain.value = props.gain

  const transferPropsToBufferSourceNode = () => {
    const { buffer: { duration } } = props

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

    const { loopStart, buffer } = props

    if (!buffer) return

    bufferSourceNode = context.createBufferSource()
    bufferSourceNode.buffer = buffer
    bufferSourceNode.loop = true

    transferPropsToBufferSourceNode()

    bufferSourceNode.connect(gainNode)
    if (isPlaying) bufferSourceNode.start(0, loopStart * buffer.duration)
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

      const { gain, buffer, loopStart } = props

      gainNode.gain.value = gain

      if (prevProps.buffer !== buffer || prevProps.loopStart !== loopStart) {
        replaceBufferSourceNode()
      } else if (buffer && bufferSourceNode) {
        transferPropsToBufferSourceNode()
      } else if (!buffer) {
        removeBufferSourceNode()
      }
    },

    connectTo(destination) {
      gainNode.connect(destination)
    },

    disconnectFrom(destination) {
      gainNode.disconnect(destination)
    },
  }
})
