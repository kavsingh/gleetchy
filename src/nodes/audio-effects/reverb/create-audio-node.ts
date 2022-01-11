import { curry } from 'ramda'

import reverbImpulse from '~/assets/media/impulse-reverb.wav'
import { GAudioNode } from '~/lib/g-audio-node'

import nodeType from './node-type'
import { defaultProps } from './node-props'

import type { Props } from './node-props'

const loadImpulse = async (audioContext: AudioContext, url: string) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  return audioContext.decodeAudioData(arrayBuffer)
}

export class GReverbNode extends GAudioNode<Props> {
  type = nodeType
  defaultProps = defaultProps
  reverbNode = this.audioContext.createConvolver()
  wetGainNode = this.audioContext.createGain()
  dryGainNode = this.audioContext.createGain()

  constructor(
    protected audioContext: AudioContext,
    initialProps: Partial<Props>,
  ) {
    super(audioContext, initialProps)

    this.inNode.connect(this.dryGainNode)
    this.inNode.connect(this.reverbNode)
    this.reverbNode.connect(this.wetGainNode)
    this.wetGainNode.connect(this.outNode)
    this.dryGainNode.connect(this.outNode)

    void loadImpulse(audioContext, reverbImpulse).then((buffer) => {
      this.reverbNode.buffer = buffer
    })

    this.propsUpdated()
  }

  destroy(): void {
    // noop
  }

  protected propsUpdated(): void {
    this.wetGainNode.gain.value = this.props.wetDryRatio
    this.dryGainNode.gain.value = 1 - this.props.wetDryRatio
  }
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) =>
    new GReverbNode(audioContext, { ...defaultProps, ...initProps }),
)
