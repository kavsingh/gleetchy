export type AudioNodeIdentifierMeta = {
	readonly id: string;
	readonly type: string;
};

export type AudioNodeMeta = {
	label: string;
} & AudioNodeIdentifierMeta;

export type AudioNodeState<TProps extends Record<string, unknown>> =
	AudioNodeMeta & { audioProps: TProps };

export type AudioNodeConnection = {
	from: string;
	to: string;
	color: string;
};

export type AudioFile = {
	readonly id: string;
	readonly type: string;
	readonly name: string;
	readonly buffer: AudioBuffer;
};
