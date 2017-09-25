import { curry, pick } from 'ramda'

const defaultProps = {
  gain: 1,
  loopStart: 0,
  loopEnd: 1,
  playRate: 1,
  detune: 0,
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

    bufferSourceNode.buffer = props.buffer
    bufferSourceNode.loopStart = props.loopStart * duration
    bufferSourceNode.loopEnd = props.loopEnd * duration
    bufferSourceNode.playRate.value = props.playRate
  }

  const removeBufferSourceNode = () => {
    if (!bufferSourceNode) return

    bufferSourceNode.disconnect(gainNode)
    bufferSourceNode = null
  }

  const replaceBufferSourceNode = () => {
    removeBufferSourceNode()

    if (!props.buffer) return

    bufferSourceNode = context.createBufferSource()
    bufferSourceNode.loop = true

    transferPropsToBufferSourceNode()

    if (isPlaying) bufferSourceNode.start(0, props.loopStart)
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

      Object.assign(props, ...pickProps(newProps))

      const { gain, buffer } = props

      gainNode.gain.value = gain

      if (prevProps.buffer !== buffer) replaceBufferSourceNode()
      else if (buffer && bufferSourceNode) transferPropsToBufferSourceNode()
      else if (!buffer) removeBufferSourceNode()
    },

    connectTo(destination) {
      gainNode.connectTo(destination)
    },

    disconnectFrom(destination) {
      gainNode.disconnectFrom(destination)
    },
  }
})
