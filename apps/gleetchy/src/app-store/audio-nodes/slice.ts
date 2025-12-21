import { createSlice } from "@reduxjs/toolkit";

import { defaultNodes } from "#app-store/default-nodes";
import { MAIN_OUT_ID } from "#constants/audio";
import { prefixedId } from "#lib/id";
import { stableOmit, stableFilter } from "#lib/util";
import {
	defaultProps as delayDefaultProps,
	nodeType as delayNodeType,
} from "#nodes/audio-effects/delay";
import {
	defaultProps as reverbDefaultProps,
	nodeType as reverbNodeType,
} from "#nodes/audio-effects/reverb";
import {
	defaultProps as loopDefaultProps,
	nodeType as loopNodeType,
} from "#nodes/instruments/loop";

import { loadAudioFileToNode } from "../audio-files/actions";

import type { NodeProps as DelayNodeProps } from "#nodes/audio-effects/delay";
import type { NodeProps as ReverbNodeProps } from "#nodes/audio-effects/reverb";
import type { NodeProps as LoopNodeProps } from "#nodes/instruments/loop";
import type { AudioNodeIdentifierMeta, AudioNodeState } from "#types";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AudioNodesState = defaultNodes.reduce(
	(acc: AudioNodesState, instrument) => {
		acc.byId[instrument.id] = instrument;
		acc.orderedIdentifierMeta.push({
			id: instrument.id,
			type: instrument.type,
		});
		return acc;
	},
	{ byId: {}, orderedIdentifierMeta: [] },
);

export const audioNodesSlice = createSlice({
	initialState,
	name: "audioNodes",
	reducers: {
		addAudioNode(state, { payload: id }: PayloadAction<string>) {
			const newNodeState = getNewNodeState(id);

			if (newNodeState) {
				state.byId[newNodeState.id] = newNodeState;
				state.orderedIdentifierMeta.push({
					id: newNodeState.id,
					type: newNodeState.type,
				});
			}
		},
		removeAudioNode(state, { payload: id }: PayloadAction<string>) {
			state.byId = stableOmit([id], state.byId);
			state.orderedIdentifierMeta = stableFilter(
				(meta) => meta.id !== id,
				state.orderedIdentifierMeta,
			);
		},
		duplicateAudioNode(state, { payload: id }: PayloadAction<string>) {
			const exisiting = state.byId[id];

			if (!exisiting) return;

			const duplicate = {
				...exisiting,
				id: prefixedId(exisiting.type),
				label: `${exisiting.label} Copy`,
			};

			state.byId[duplicate.id] = duplicate;

			const existingMetaIndex = state.orderedIdentifierMeta.findIndex(
				({ id: metaId }) => metaId === exisiting.id,
			);

			if (existingMetaIndex === -1) {
				state.orderedIdentifierMeta.push({
					id: duplicate.id,
					type: duplicate.type,
				});
			} else {
				state.orderedIdentifierMeta.splice(existingMetaIndex + 1, 0, duplicate);
			}
		},
		updateAudioNodeProps(
			state,
			action: PayloadAction<{
				id: string;
				audioProps: Record<string, unknown>;
			}>,
		) {
			const { id, audioProps } = action.payload;
			const existing = state.byId[id];

			if (existing) Object.assign(existing.audioProps, audioProps);
		},
		updateAudioNodeLabel(
			state,
			action: PayloadAction<{ id: string; label: string }>,
		) {
			const { id, label } = action.payload;
			const existing = state.byId[id];

			if (existing) existing.label = label;
		},
	},
	extraReducers(builder) {
		builder.addCase(loadAudioFileToNode.fulfilled, (state, action) => {
			const { nodeId, file } = action.payload;
			const existing = state.byId[nodeId];

			if (existing?.type !== loopNodeType) return;

			// oxlint-disable-next-line no-unsafe-type-assertion
			const audioProps = existing.audioProps as LoopNodeProps;

			audioProps.audioBuffer = file.buffer;
			audioProps.fileName = file.name;
			audioProps.fileType = file.type;
		});
	},
	selectors: {
		selectAudioNodes(state) {
			return state.byId;
		},
		// TODO: Better naming
		selectNodesIdentifierMeta(state) {
			return state.orderedIdentifierMeta;
		},
		selectMainOutNode(state) {
			const mainOut = state.byId[MAIN_OUT_ID];

			if (!mainOut) throw new Error("Main out not found");

			return mainOut;
		},
	},
});

function getNewNodeState(type: string) {
	switch (type) {
		case delayNodeType: {
			const state: AudioNodeState<DelayNodeProps> = {
				type,
				id: prefixedId(delayNodeType),
				label: "DX",
				audioProps: { ...delayDefaultProps },
			};

			return state;
		}
		case reverbNodeType: {
			const state: AudioNodeState<ReverbNodeProps> = {
				type,
				id: prefixedId(reverbNodeType),
				label: "RX",
				audioProps: { ...reverbDefaultProps },
			};

			return state;
		}
		case loopNodeType: {
			const state: AudioNodeState<LoopNodeProps> = {
				type,
				id: prefixedId(loopNodeType),
				label: "LX",
				audioProps: { ...loopDefaultProps },
			};

			return state;
		}
		default: {
			return undefined;
		}
	}
}

interface AudioNodesState {
	byId: Record<string, AudioNodeState<KnownProps>>;
	orderedIdentifierMeta: AudioNodeIdentifierMeta[];
}

type KnownProps =
	| DelayNodeProps
	| ReverbNodeProps
	| LoopNodeProps
	| Record<string, unknown>;
