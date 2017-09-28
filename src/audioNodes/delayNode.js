import { curry, pick } from 'ramda'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  delayTime: 0,
  wetDryRatio: 0.5,
}

const pickProps = pick(Object.keys(defaultProps))

const updateWetDry = (wetDryRatio, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
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

  updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)

  delayNode.delayTime.value = props.delayTime

  const getInNode = () => inNode
  const getOutNode = () => outNode

  return {
    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))

      delayNode.delayTime.value = props.delayTime
      updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
    },

    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  }
})
