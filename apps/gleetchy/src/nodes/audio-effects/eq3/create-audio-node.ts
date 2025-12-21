import { GAudioNode } from "#lib/g-audio-node";

import { defaultProps } from "./node-props";
import { nodeType } from "./node-type";

import type { Props } from "./node-props";

export class GEq3Node extends GAudioNode<Props> {
	type = nodeType;
	defaultProps = defaultProps;
	lowNode = this.audioContext.createBiquadFilter();
	midNode = this.audioContext.createBiquadFilter();
	highNode = this.audioContext.createBiquadFilter();

	constructor(audioContext: AudioContext, props: Props) {
		super(audioContext, props);

		this.lowNode.type = "lowshelf";
		this.lowNode.frequency.value = 320;

		this.midNode.type = "peaking";
		this.midNode.frequency.value = 1000;
		this.midNode.Q.value = 0.5;

		this.highNode.type = "highshelf";
		this.highNode.frequency.value = 3200;

		this.inNode.connect(this.highNode);
		this.highNode.connect(this.midNode);
		this.midNode.connect(this.lowNode);
		this.lowNode.connect(this.outNode);

		this.propsUpdated();
	}

	// oxlint-disable-next-line class-methods-use-this
	destroy(): void {
		// noop
	}

	protected propsUpdated(): void {
		this.lowNode.gain.value = this.props.lowGain * 40;
		this.midNode.gain.value = this.props.midGain * 40;
		this.highNode.gain.value = this.props.highGain * 40;
	}
}

export function createAudioNode(
	audioContext: AudioContext,
	initProps: Partial<Props>,
) {
	return new GEq3Node(audioContext, { ...defaultProps, ...initProps });
}
