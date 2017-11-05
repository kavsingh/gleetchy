import { curry, pick } from 'ramda'
import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { createConnect, createDisconnect } from '~/util/connection'
import nodeType from './nodeType'
import nodeProps from './nodeProps'

const updateWetDry = (wetDryRatio, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

export const pickProps = pick(Object.keys(nodeProps))

export default curry((audioContext, initProps) => {
  const props = { ...nodeProps, ...pickProps(initProps || {}) }
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
    type: nodeType,

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
