/* eslint-disable @typescript-eslint/no-explicit-any */

export type AudioNodeIdentifierMeta = {
	readonly id: string;
	readonly type: string;
};

export type AudioNodeMeta = {
	label: string;
} & AudioNodeIdentifierMeta;

export type AudioNodeState<PROPS extends Record<string, unknown>> =
	AudioNodeMeta & {
		audioProps: PROPS;
	};

export type AudioNodeReturn = () => AudioNode;

export type GAudioNodeConnectors = {
	getInNode: AudioNodeReturn;
	getOutNode: AudioNodeReturn;
};

export type GAudioNodeConnectApi = {
	connect(node: AudioNode | GAudioNodeConnectors): void;
	disconnect(node?: AudioNode | GAudioNodeConnectors): void;
} & GAudioNodeConnectors;

export type GAudioNodeApi<
	P extends Record<string, unknown>,
	T extends string,
> = {
	type: T;
	set(props: Partial<P>): void;
};

export type GAudioNode<
	P extends Record<string, unknown> = any,
	T extends string = any,
> = GAudioNodeConnectApi & GAudioNodeApi<P, T>;

export type GInstrumentNodeApi<
	P extends Record<string, unknown>,
	T extends string,
	S extends (data: any) => unknown,
> = {
	play(): void;
	stop(): void;
	subscribe?(subscriber: S): () => void;
} & GAudioNodeApi<P, T>;

export type GInstrumentNode<
	P extends Record<string, unknown> = any,
	T extends string = any,
	S extends (data: any) => unknown = any,
> = GAudioNodeConnectApi & GInstrumentNodeApi<P, T, S>;

export type AudioNodeConnection = {
	from: string;
	to: string;
	color: string;
};

export type AudioFileData = {
	buffer: ArrayBuffer;
	fileName: string;
	fileType: string;
};

export type DecodedAudioFileData = {
	audioBuffer: AudioBuffer;
	fileName: string;
	fileType: string;
};
