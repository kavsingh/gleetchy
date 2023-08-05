import { selectConnections } from "~/app-store/connections/selectors";
import { MAIN_OUT_ID } from "~/constants/audio";
import {
	hasAudioEffectType,
	hasInstrumentType,
	hasConnectionTo,
} from "~/lib/audio";

import { selectAudioEngineSubscriptionData } from "../audio-engine/selectors";
import { createDeepEqualSelector } from "../lib/selector";

import type { AppState } from "../create";
import type { AudioNodeMeta } from "~/types";

export const selectAudioNodes = (state: AppState) => state.audioNodes.byId;

// TODO: Better naming
export function selectNodesIdentifierMeta(state: AppState) {
	return state.audioNodes.orderedIdentifierMeta;
}

export const selectInstrumentsIdentifierMeta = createDeepEqualSelector(
	selectNodesIdentifierMeta,
	(meta) => meta.filter(hasInstrumentType),
);

export const selectAudioEffectsIdentifierMeta = createDeepEqualSelector(
	selectNodesIdentifierMeta,
	(meta) => meta.filter(hasAudioEffectType),
);

export function selectMainOutNode(state: AppState) {
	const mainOut = state.audioNodes.byId[MAIN_OUT_ID];

	if (!mainOut) throw new Error("Main out not found");

	return mainOut;
}

export const selectMainOutMeta = createDeepEqualSelector(
	selectMainOutNode,
	({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
);

export const selectActiveAudioNodeIds = createDeepEqualSelector(
	selectNodesIdentifierMeta,
	selectConnections,
	selectMainOutNode,
	(meta, connections, mainOut) => {
		const connectedToMain = hasConnectionTo.bind(null, connections, mainOut.id);

		return meta.map(({ id }) => id).filter(connectedToMain);
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

export function selectAudioNodeSubscriptionData(
	state: AppState,
	nodeId: string,
) {
	return selectAudioEngineSubscriptionData(state)[nodeId];
}
