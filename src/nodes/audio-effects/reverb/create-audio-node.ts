import { always, curry } from 'ramda'

import { GAudioNode } from '~/types'
import { decodeAudioData } from '~/apis/audio'
import { makeConnectable } from '~/lib/connection'
import reverbImpulse from '~/assets/media/impulse-reverb.wav'

import { defaultProps, Props } from './node-props'
import nodeType from './node-type'

const updateWetDry = (
  wetDryRatio: number,
  wetGainNode: GainNode,
  dryGainNode: GainNode,
) => {
  Object.assign(wetGainNode.gain, { value: wetDryRatio })
  Object.assign(dryGainNode.gain, { value: 1 - wetDryRatio })
}

const loadImpulse = async (audioContext: AudioContext, url: string) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  return decodeAudioData(arrayBuffer, audioContext)
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) => {
    const props: Props = { ...defaultProps, ...initProps }
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

    return makeConnectable<GAudioNode<Props, typeof nodeType>>({
      getInNode: always(inNode),
      getOutNode: always(outNode),
    })({
      type: nodeType,

      set(newProps: Partial<Props> = {}) {
        Object.assign(props, newProps)
        updateWetDry(props.wetDryRatio, wetGainNode, dryGainNode)
      },
    })
  },
)
