export interface AudioNodeIdentifierMeta {
	readonly id: string;
	readonly type: string;
}

export interface AudioNodeMeta extends AudioNodeIdentifierMeta {
	label: string;
}

export interface AudioNodeState<
	TProps extends GenericObject,
> extends AudioNodeMeta {
	audioProps: TProps;
}

export interface AudioNodeConnection {
	fromId: string;
	toId: string;
	color: string;
}

export type ConnectionIdent = Pick<AudioNodeConnection, "fromId" | "toId">;

export interface AudioFile {
	readonly id: string;
	readonly type: string;
	readonly name: string;
	readonly buffer: AudioBuffer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericObject = Record<PropertyKey, any>;
