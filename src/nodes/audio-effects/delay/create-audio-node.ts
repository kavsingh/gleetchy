import { curry } from "ramda";

import { DELAY_UPPER_BOUND } from "~/constants/audio";
import { GAudioNode } from "~/lib/g-audio-node";

import { defaultProps } from "./node-props";
import nodeType from "./node-type";

import type { Props } from "./node-props";

export class GDelayNode extends GAudioNode<Props> {
	type = nodeType;
	defaultProps = defaultProps;

	delayNode: DelayNode = this.audioContext.createDelay(DELAY_UPPER_BOUND);
	wetGainNode: GainNode = this.audioContext.createGain();
	dryGainNode: GainNode = this.audioContext.createGain();

	constructor(
		protected audioContext: AudioContext,
		initialProps: Props,
	) {
		super(audioContext, initialProps);

		this.inNode.connect(this.dryGainNode);
		this.inNode.connect(this.delayNode);
		this.delayNode.connect(this.wetGainNode);
		this.wetGainNode.connect(this.outNode);
		this.dryGainNode.connect(this.outNode);

		this.propsUpdated();
	}

	destroy(): void {
		// noop
	}

	protected propsUpdated(): void {
		this.delayNode.delayTime.value = this.props.delayTime;
		this.wetGainNode.gain.value = this.props.wetDryRatio;
		this.dryGainNode.gain.value = 1 - this.props.wetDryRatio;
	}
}

export default curry(
	(audioContext: AudioContext, initProps: Partial<Props>) =>
		new GDelayNode(audioContext, { ...defaultProps, ...initProps }),
);
