export interface AudioNodeIdentifierMeta {
	readonly id: string;
	readonly type: string;
}

export interface AudioNodeMeta extends AudioNodeIdentifierMeta {
	label: string;
}

export interface AudioNodeState<TProps extends GenericObject>
	extends AudioNodeMeta {
	audioProps: TProps;
}

export interface AudioNodeConnection {
	from: string;
	to: string;
	color: string;
}

export interface AudioFile {
	readonly id: string;
	readonly type: string;
	readonly name: string;
	readonly buffer: AudioBuffer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericObject = Record<PropertyKey, any>;
