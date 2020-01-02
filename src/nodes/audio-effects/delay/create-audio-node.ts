import { always, curry } from 'ramda'

import { DELAY_UPPER_BOUND } from '~/constants/audio'
import { GAudioNode } from '~/types'
import { makeConnectable } from '~/lib/connection'

import { defaultProps, Props } from './nodeProps'
import nodeType from './node-type'

const updateWetDry = (
  wetDryRatio: number,
  wetGainNode: GainNode,
  dryGainNode: GainNode,
) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>): GAudioNode => {
    const props: Props = { ...defaultProps, ...initProps }
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

    return makeConnectable({
      getInNode: always(inNode),
      getOutNode: always(outNode),
    })({
      type: nodeType,

      set(newProps: Partial<Props> = {}) {
        Object.assign(props, newProps)

        delayNode.delayTime.value = props.delayTime
        updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
      },
    })
  },
)
