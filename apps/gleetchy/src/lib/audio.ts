import type { GAudioNode, GInstrumentNode } from "#lib/g-audio-node";
import type {
	AudioNodeConnection,
	AudioNodeMeta,
	ConnectionIdent,
} from "#types";

export function hasAudioEffectType(item: { type?: string | undefined }) {
	return /^audio_effect_/i.test(item.type ?? "");
}

export function hasInstrumentType(item: { type?: string | undefined }) {
	return /^instrument_/i.test(item.type ?? "");
}

export function isAudioEffectNode(
	node: GAudioNode | GInstrumentNode,
): node is GAudioNode {
	return hasAudioEffectType(node);
}

export function isInstrumentNode(
	node: GAudioNode | GInstrumentNode,
): node is GInstrumentNode {
	return hasInstrumentType(node as GAudioNode);
}

export function isSameConnection(a: ConnectionIdent, b: ConnectionIdent) {
	return a.fromId === b.fromId && a.toId === b.toId;
}

export function getConnectionsFor(
	id: string,
	connections: AudioNodeConnection[],
) {
	return connections.filter((c) => c.fromId === id || c.toId === id);
}

export function hasConnectionTo(
	connections: ConnectionIdent[],
	toId: string,
	fromId: string,
) {
	if (connections.length === 0) return false;

	function hasDownstreamConnection(innerFromId: string): boolean {
		const connectionsFromId = connections.filter((connection) => {
			return connection.fromId === innerFromId;
		});

		if (connectionsFromId.length === 0) return false;

		if (connectionsFromId.some((c) => c.toId === toId)) return true;

		return connectionsFromId.some((c) => hasDownstreamConnection(c.toId));
	}

	return hasDownstreamConnection(fromId);
}

export function canConnectNodes(
	connections: ConnectionIdent[],
	{ id: fromId }: Pick<AudioNodeMeta, "id">,
	{ id: toId }: Pick<AudioNodeMeta, "id">,
) {
	return fromId !== toId && !hasConnectionTo(connections, fromId, toId);
}

export function getConnectionBetween<TNodeId extends Pick<AudioNodeMeta, "id">>(
	connections: AudioNodeConnection[],
	{ id: fromId }: TNodeId,
	{ id: toId }: TNodeId,
) {
	return connections.find((connection) => {
		return isSameConnection({ fromId, toId }, connection);
	});
}
