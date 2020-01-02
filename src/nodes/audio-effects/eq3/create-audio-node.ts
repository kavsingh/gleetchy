import { always, curry } from 'ramda'

import { GAudioNode } from '~/types'
import { makeConnectable } from '~/lib/connection'

import { defaultProps, Props } from './node-props'
import nodeType from './node-type'

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>): GAudioNode => {
    const props: Props = { ...defaultProps, ...initProps }
    const lowNode = audioContext.createBiquadFilter()
    const midNode = audioContext.createBiquadFilter()
    const highNode = audioContext.createBiquadFilter()

    const transferProps = () => {
      lowNode.gain.value = props.lowGain * 40
      midNode.gain.value = props.midGain * 40
      highNode.gain.value = props.highGain * 40
    }

    lowNode.type = 'lowshelf'
    lowNode.frequency.value = 320

    midNode.type = 'peaking'
    midNode.frequency.value = 1000
    midNode.Q.value = 0.5

    highNode.type = 'highshelf'
    highNode.frequency.value = 3200

    highNode.connect(midNode)
    midNode.connect(lowNode)

    transferProps()

    return makeConnectable({
      getInNode: always(highNode),
      getOutNode: always(lowNode),
    })({
      type: nodeType,

      set(newProps: Partial<Props> = {}) {
        Object.assign(props, newProps)
        transferProps()
      },
    })
  },
)
