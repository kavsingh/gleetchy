import { hasAudioEffectType, hasInstrumentType } from "#lib/audio";

import { createDeepEqualSelector } from "../lib/selector";

import { audioNodesSlice } from "./slice";

import type { AudioNodeMeta } from "#types";

export const {
	selectAudioNodes,
	selectNodesIdentifierMeta,
	selectMainOutNode,
} = audioNodesSlice.selectors;

export const selectInstrumentsIdentifierMeta = createDeepEqualSelector(
	[selectNodesIdentifierMeta],
	(meta) => meta.filter(hasInstrumentType),
);

export const selectAudioEffectsIdentifierMeta = createDeepEqualSelector(
	[selectNodesIdentifierMeta],
	(meta) => meta.filter(hasAudioEffectType),
);

export const selectMainOutMeta = createDeepEqualSelector(
	[selectMainOutNode],
	({ id, type, label }): AudioNodeMeta => ({ id, type, label }),
);
