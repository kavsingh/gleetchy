import { curry } from 'ramda'

import { GAudioNode } from '~/lib/g-audio-node'

import nodeType from './node-type'
import { defaultProps } from './node-props'
import { loadImpulse } from './impulses'

import type { Props } from './node-props'

export class GReverbNode extends GAudioNode<Props> {
  type = nodeType
  defaultProps = defaultProps

  private reverbNode = this.audioContext.createConvolver()
  private wetGainNode = this.audioContext.createGain()
  private dryGainNode = this.audioContext.createGain()

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

    this.propsUpdated(this.props)
  }

  destroy(): void {
    // noop
  }

  protected propsUpdated(props: Props, previousProps?: Props): void {
    this.wetGainNode.gain.value = props.wetDryRatio
    this.dryGainNode.gain.value = 1 - props.wetDryRatio

    if (props.impulse !== previousProps?.impulse) {
      void loadImpulse(this.audioContext, props.impulse).then((buffer) => {
        this.reverbNode.buffer = buffer
      })
    }
  }
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) =>
    new GReverbNode(audioContext, { ...defaultProps, ...initProps }),
)
