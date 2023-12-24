import type { GAudioNode, GInstrumentNode } from "#lib/g-audio-node";
import type { AudioNodeConnection, AudioNodeMeta } from "#types";

export function hasAudioEffectType<T extends { type?: string }>(item: T) {
	return /^audio_effect_/i.test(item.type ?? "");
}

export function hasInstrumentType<T extends { type?: string }>(item: T) {
	return /^instrument_/i.test(item.type ?? "");
}

export function isAudioEffectNode(
	node: GAudioNode | GInstrumentNode | AudioNode,
): node is GAudioNode {
	return hasAudioEffectType(node as GAudioNode);
}

export function isInstrumentNode(
	node: GAudioNode | GInstrumentNode | AudioNode,
): node is GInstrumentNode {
	return hasInstrumentType(node as GAudioNode);
}

type Connection = Omit<AudioNodeConnection, "color">;

export function isSameConnection(
	connection1: Connection,
	connection2: Connection,
) {
	return (
		connection1.from === connection2.from && connection1.to === connection2.to
	);
}

export function getConnectionsFor(
	id: string,
	connections: AudioNodeConnection[],
) {
	return connections.filter(({ from, to }) => from === id || to === id);
}

export function hasConnectionTo(
	connections: Connection[],
	toId: string,
	fromId: string,
) {
	if (!connections.length) return false;

	const checkDownstreamConnection = (innerFromId: string): boolean => {
		const connectionsFromId = connections.filter(
			({ from }) => from === innerFromId,
		);

		if (!connectionsFromId.length) return false;
		if (connectionsFromId.some(({ to }) => to === toId)) return true;

		return connectionsFromId.reduce(
			(accum: boolean, connection) =>
				accum || checkDownstreamConnection(connection.to),
			false,
		);
	};

	return checkDownstreamConnection(fromId);
}

export function canConnectNodes(
	connections: Connection[],
	{ id: fromId }: Pick<AudioNodeMeta, "id">,
	{ id: toId }: Pick<AudioNodeMeta, "id">,
) {
	return fromId !== toId && !hasConnectionTo(connections, fromId, toId);
}

export function getConnectionBetween(
	connections: AudioNodeConnection[],
	{ id: from }: Pick<AudioNodeMeta, "id">,
	{ id: to }: Pick<AudioNodeMeta, "id">,
) {
	return connections.find((connection) =>
		isSameConnection({ from, to }, connection),
	);
}
