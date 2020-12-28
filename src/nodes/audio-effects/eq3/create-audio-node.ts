import { curry } from 'ramda'

import { GAudioNode } from '~/lib/g-audio-node'

import nodeType from './node-type'
import { defaultProps } from './node-props'
import type { Props } from './node-props'

export class GEq3Node extends GAudioNode<Props> {
  type = nodeType
  defaultProps = defaultProps
  lowNode = this.audioContext.createBiquadFilter()
  midNode = this.audioContext.createBiquadFilter()
  highNode = this.audioContext.createBiquadFilter()

  constructor(protected audioContext: AudioContext, props: Partial<Props>) {
    super(audioContext, props)

    this.lowNode.type = 'lowshelf'
    this.lowNode.frequency.value = 320

    this.midNode.type = 'peaking'
    this.midNode.frequency.value = 1000
    this.midNode.Q.value = 0.5

    this.highNode.type = 'highshelf'
    this.highNode.frequency.value = 3200

    this.inNode.connect(this.highNode)
    this.highNode.connect(this.midNode)
    this.midNode.connect(this.lowNode)
    this.lowNode.connect(this.outNode)

    this.propsUpdated()
  }

  protected propsUpdated(): void {
    this.lowNode.gain.value = this.props.lowGain * 40
    this.midNode.gain.value = this.props.midGain * 40
    this.highNode.gain.value = this.props.highGain * 40
  }

  destroy(): void {
    // noop
  }
}

export default curry(
  (audioContext: AudioContext, initProps: Partial<Props>) =>
    new GEq3Node(audioContext, { ...defaultProps, ...initProps }),
)
