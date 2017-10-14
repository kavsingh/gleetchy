import { always, curry, pick } from 'ramda'
import { FX_EQ } from '../constants/nodeTypes'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  eqMid: 0,
  eqLow: 0,
  eqHigh: 0,
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
    eqLowNode.gain.value = props.eqLow * 40
    eqMidNode.gain.value = props.eqMid * 40
    eqHighNode.gain.value = props.eqHigh * 40
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
    type: FX_EQ,

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
