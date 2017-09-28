import { always, curry, pick } from 'ramda'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  lowGain: 1,
  midGain: 1,
  highGain: 1,
}

const pickProps = pick(Object.keys(defaultProps))

export const createEq3Node = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const eqLowNode = audioContext.createBiquadFilter()
  const eqMidNode = audioContext.createBiquadFilter()
  const eqHighNode = audioContext.createBiquadFilter()
  const getInNode = always(eqHighNode)
  const getOutNode = always(eqLowNode)

  const transferProps = () => {
    eqLowNode.gain.value = props.lowGain * 40
    eqMidNode.gain.value = props.midGain * 40
    eqHighNode.gain.value = props.highGain * 40
  }

  eqLowNode.type = 'lowshelf'
  eqLowNode.frequency.value = 320

  eqMidNode.type = 'peaking'
  eqMidNode.frequency.value = 1000
  eqMidNode.Q.value = 0.5

  eqHighNode.type = 'highshelf'
  eqHighNode.frequency.value = 3200

  eqHighNode.connect(eqMidNode)
  eqMidNode.connect(eqLowNode)

  transferProps()

  return {
    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))
      transferProps()
    },

    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  }
})
