import { createSlice } from "@reduxjs/toolkit";

import { stableWithout } from "#lib/util";
import { nodeColorPool } from "#style/color";

import { removeAudioNode } from "../audio-nodes/actions";
import defaultNodes from "../default-nodes";

import type { AudioNodeConnection } from "#types";
import type { PayloadAction } from "@reduxjs/toolkit";

const mainOut = defaultNodes[0];
const loop1 = defaultNodes[1];
const loop2 = defaultNodes[2];

const initialState: ConnectionsState = [
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	{ from: loop1.id, to: mainOut.id, color: nodeColorPool[0]! },
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	{ from: loop2.id, to: mainOut.id, color: nodeColorPool[1]! },
];

export const connectionsSlice = createSlice({
	initialState,
	name: "connections",
	reducers: {
		addConnection(state, { payload: { fromId, toId } }: ConnectionAction) {
			if (!state.find(connectionIs({ fromId, toId }))) {
				state.push(createConnection(state, { fromId, toId }));
			}
		},
		removeConnection(state, { payload: { fromId, toId } }: ConnectionAction) {
			const idx = state.findIndex(connectionIs({ fromId, toId }));

			if (idx !== -1) state.splice(idx, 1);
		},
		toggleConnection(state, { payload: { fromId, toId } }: ConnectionAction) {
			const idx = state.findIndex(connectionIs({ fromId, toId }));

			if (idx !== -1) state.splice(idx, 1);
			else state.push(createConnection(state, { fromId, toId }));
		},
	},
	extraReducers(builder) {
		builder.addCase(removeAudioNode, (state, { payload: id }) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			state = stableWithout(
				state.filter(({ from, to }) => from === id || to === id),
				state,
			);
		});
	},
});

function createConnection(
	state: AudioNodeConnection[],
	{ fromId, toId }: ConnectionDescriptor,
): AudioNodeConnection {
	return {
		from: fromId,
		to: toId,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		color: nodeColorPool[state.length % nodeColorPool.length]!,
	};
}

function connectionIs({ fromId, toId }: ConnectionDescriptor) {
	return function matchConnection({ from, to }: AudioNodeConnection) {
		return from === fromId && to === toId;
	};
}

type ConnectionsState = AudioNodeConnection[];

type ConnectionAction = PayloadAction<ConnectionDescriptor>;

type ConnectionDescriptor = {
	fromId: string;
	toId: string;
};
