import { curry, pick } from 'ramda'
import { DELAY_UPPER_BOUND } from '../constants/audio'
import { FX_DELAY } from '../constants/nodeTypes'
import nodeProps from '../constants/nodeProps'
import { createConnect, createDisconnect } from './connection'

const updateWetDry = (wetDryRatio, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

const defaultProps = { ...nodeProps[FX_DELAY] }

export const pickProps = pick(Object.keys(defaultProps))

export const createDelayNode = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const delayNode = audioContext.createDelay(DELAY_UPPER_BOUND)
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
    type: FX_DELAY,

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
