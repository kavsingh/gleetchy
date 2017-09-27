import { curry, pick } from 'ramda'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  delayTime: 0,
  wetDry: 0.5,
}

const pickProps = pick(Object.keys(defaultProps))

const updateWetDry = (wetDry, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDry })
  Object.assign(dryGainNode.gain, { value: 1 - wetDry })
}

export const createDelayNode = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps) }
  const delayNode = audioContext.createDelay(props.delayTime)
  const inNode = audioContext.createGain()
  const outNode = audioContext.createGain()
  const wetGainNode = audioContext.createGain()
  const dryGainNode = audioContext.createGain()

  inNode.connect(dryGainNode)
  inNode.connect(delayNode)
  delayNode.connect(wetGainNode)
  wetGainNode.connect(outNode)
  dryGainNode.connect(outNode)

  updateWetDry(props.wetDry, wetGainNode, dryGainNode)

  delayNode.delayTime.value = 4

  return {
    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))

      delayNode.delayTime.value = props.delayTime
      updateWetDry(props.wetDry, wetGainNode, dryGainNode)
    },

    getInNode() {
      return inNode
    },

    getOutNode() {
      return outNode
    },

    connect: createConnect(() => outNode),

    disconnect: createDisconnect(() => outNode),
  }
})
