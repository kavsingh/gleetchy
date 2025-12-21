import { hasConnectionTo } from "#lib/audio";

import {
	selectAudioEffectsIdentifierMeta,
	selectAudioNodes,
	selectInstrumentsIdentifierMeta,
	selectMainOutMeta,
	selectMainOutNode,
	selectNodesIdentifierMeta,
} from "../audio-nodes/selectors";
import { createDeepEqualSelector } from "../lib/selector";

import { connectionsSlice } from "./slice";

import type { AudioNodeMeta } from "#types";

export const selectConnections =
	connectionsSlice.selectSlice.bind(connectionsSlice);

export const selectActiveAudioNodeIds = createDeepEqualSelector(
	selectNodesIdentifierMeta,
	selectConnections,
	selectMainOutNode,
	(meta, connections, mainOut) => {
		return meta
			.map(({ id }) => id)
			.filter((id) => hasConnectionTo(connections, mainOut.id, id));
	},
);

export const selectConnectableSources = createDeepEqualSelector(
	selectAudioNodes,
	selectInstrumentsIdentifierMeta,
	selectAudioEffectsIdentifierMeta,
	(nodes, instruments, effects): AudioNodeMeta[] => [
		...instruments.map((meta) => ({
			...meta,
			label: nodes[meta.id]?.label ?? "",
		})),
		...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label ?? "" })),
	],
);

export const selectConnectableTargets = createDeepEqualSelector(
	selectAudioNodes,
	selectAudioEffectsIdentifierMeta,
	selectMainOutMeta,
	(nodes, effects, out): AudioNodeMeta[] => [
		...effects.map((meta) => ({ ...meta, label: nodes[meta.id]?.label ?? "" })),
		out,
	],
);
