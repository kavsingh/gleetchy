import { createSlice } from "@reduxjs/toolkit";
import { pick } from "lodash";

import initialNodes from "~/app-store/default-nodes";
import {
	defaultProps as delayDefaultProps,
	nodeType as delayNodeType,
} from "~/nodes/audio-effects/delay";
import {
	defaultProps as reverbDefaultProps,
	nodeType as reverbNodeType,
} from "~/nodes/audio-effects/reverb";
import {
	defaultProps as loopDefaultProps,
	nodeType as loopNodeType,
} from "~/nodes/instruments/loop";
import { prefixedId } from "~/lib/id";
import { stableOmit, stableFilter } from "~/lib/util";

import { decodeAudioFile } from "../audio-files/actions";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AudioNodeIdentifierMeta, AudioNodeState } from "~/types";
import type { NodeProps as DelayNodeProps } from "~/nodes/audio-effects/delay";
import type { NodeProps as ReverbNodeProps } from "~/nodes/audio-effects/reverb";
import type { NodeProps as LoopNodeProps } from "~/nodes/instruments/loop";

const initialState: AudioNodesState = initialNodes.reduce(
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
		addAudioNode: (state, { payload: id }: PayloadAction<string>) => {
			const newNodeState = getNewNodeState(id);

			if (newNodeState) {
				state.byId[newNodeState.id] = newNodeState;
				state.orderedIdentifierMeta.push({
					id: newNodeState.id,
					type: newNodeState.type,
				});
			}
		},
		removeAudioNode: (state, { payload: id }: PayloadAction<string>) => {
			state.byId = stableOmit([id], state.byId);
			state.orderedIdentifierMeta = stableFilter(
				(meta) => meta.id !== id,
				state.orderedIdentifierMeta,
			);
		},
		duplicateAudioNode: (state, { payload: id }: PayloadAction<string>) => {
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
		updateAudioNodeProps: (
			state,
			action: PayloadAction<{
				id: string;
				audioProps: Record<string, unknown>;
			}>,
		) => {
			const { id, audioProps } = action.payload;
			const existing = state.byId[id];

			if (existing) Object.assign(existing.audioProps, audioProps);
		},
		updateAudioNodeLabel: (
			state,
			action: PayloadAction<{ id: string; label: string }>,
		) => {
			const { id, label } = action.payload;
			const existing = state.byId[id];

			if (existing) existing.label = label;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(decodeAudioFile.fulfilled, (state, action) => {
			if (!action.payload) return;

			const { id, file } = action.payload;
			const existing = state.byId[id];

			if (existing) {
				Object.assign(
					existing.audioProps,
					pick(file, Object.keys(existing.audioProps)),
				);
			}
		});
	},
});

const getNewNodeState = (type: string) => {
	switch (type) {
		case delayNodeType:
			return {
				type,
				id: prefixedId(delayNodeType),
				label: "DX",
				audioProps: { ...delayDefaultProps },
			} as AudioNodeState<DelayNodeProps>;
		case reverbNodeType: {
			return {
				type,
				id: prefixedId(reverbNodeType),
				label: `RX`,
				audioProps: { ...reverbDefaultProps },
			} as AudioNodeState<ReverbNodeProps>;
		}
		case loopNodeType: {
			return {
				type,
				id: prefixedId(loopNodeType),
				label: "LX",
				audioProps: { ...loopDefaultProps },
			} as AudioNodeState<LoopNodeProps>;
		}
		default:
			return null;
	}
};

interface AudioNodesState {
	byId: {
		[key: string]: AudioNodeState<KnownProps>;
	};
	orderedIdentifierMeta: AudioNodeIdentifierMeta[];
}

type KnownProps =
	| DelayNodeProps
	| ReverbNodeProps
	| LoopNodeProps
	| Record<string, unknown>;
