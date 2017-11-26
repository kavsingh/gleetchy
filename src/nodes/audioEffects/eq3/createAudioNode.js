import { always, curry, pick } from 'ramda'
import { connectable } from '~/util/connection'
import nodeType from './nodeType'
import nodeProps from './nodeProps'

export const pickProps = pick(Object.keys(nodeProps))

export default curry((audioContext, initProps) => {
  const props = { ...nodeProps, ...pickProps(initProps || {}) }
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

  return connectable({
    getInNode: always(highNode),
    getOutNode: always(lowNode),
  })({
    type: nodeType,

    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))
      transferProps()
    },
  })
})
