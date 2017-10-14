import { curry, pick } from 'ramda'
import reverbImpulse from '../media/impulse_reverb.wav'
import { FX_REVERB } from '../constants/nodeTypes'
import { decodeAudioDataP } from '../util/audio'
import { createConnect, createDisconnect } from './connection'

const defaultProps = {
  wetDryRatio: 0.5,
}

const pickProps = pick(Object.keys(defaultProps))

const updateWetDry = (wetDryRatio, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

const loadImpulse = async (audioContext, url) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  return decodeAudioDataP(audioContext, arrayBuffer)
}

export const createReverbNode = curry((audioContext, initProps) => {
  const props = { ...defaultProps, ...pickProps(initProps || {}) }
  const reverbNode = audioContext.createConvolver()
  const inNode = audioContext.createGain()
  const outNode = audioContext.createGain()
  const wetGainNode = audioContext.createGain()
  const dryGainNode = audioContext.createGain()

  inNode.connect(dryGainNode)
  inNode.connect(reverbNode)
  reverbNode.connect(wetGainNode)
  wetGainNode.connect(outNode)
  dryGainNode.connect(outNode)

  updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)

  const getInNode = () => inNode
  const getOutNode = () => outNode

  loadImpulse(audioContext, reverbImpulse).then(buffer => {
    reverbNode.buffer = buffer
  })

  return {
    type: FX_REVERB,

    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))
      updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
    },

    getInNode,
    getOutNode,
    connect: createConnect(getOutNode),
    disconnect: createDisconnect(getOutNode),
  }
})
