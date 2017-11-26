import { always, curry, pick } from 'ramda'
import { connectable } from '~/util/connection'
import { decodeAudioData } from '~/apis/audio'
import reverbImpulse from '~/assets/media/impulse_reverb.wav'
import nodeProps from './nodeProps'
import nodeType from './nodeType'

const updateWetDry = (wetDryRatio, wetGainNode, dryGainNode) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

const loadImpulse = async (audioContext, url) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  return decodeAudioData(arrayBuffer, audioContext)
}

export const pickProps = pick(Object.keys(nodeProps))

export default curry((audioContext, initProps) => {
  const props = { ...nodeProps, ...pickProps(initProps || {}) }
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

  loadImpulse(audioContext, reverbImpulse).then(buffer => {
    reverbNode.buffer = buffer
  })

  return connectable({
    getInNode: always(inNode),
    getOutNode: always(outNode),
  })({
    type: nodeType,

    set(newProps = {}) {
      Object.assign(props, pickProps(newProps))
      updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
    },
  })
})
