import { createSlice } from "@reduxjs/toolkit";

import { getConnectionsFor, isSameConnection } from "#lib/audio";
import { stableWithout } from "#lib/util";
import { nodeColorPool } from "#style/color";

import { removeAudioNode } from "../audio-nodes/actions";
import defaultNodes from "../default-nodes";

import type { AudioNodeConnection, ConnectionIdent } from "#types";
import type { PayloadAction } from "@reduxjs/toolkit";

const mainOut = defaultNodes[0];
const loop1 = defaultNodes[1];
const loop2 = defaultNodes[2];

const initialState: ConnectionsState = [
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	{ fromId: loop1.id, toId: mainOut.id, color: nodeColorPool[0]! },
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	{ fromId: loop2.id, toId: mainOut.id, color: nodeColorPool[1]! },
];

export const connectionsSlice = createSlice({
	initialState,
	name: "connections",
	reducers: {
		addConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			if (!state.find((c) => isSameConnection(payload, c))) {
				state.push(createConnection(state, payload));
			}
		},
		removeConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			const idx = state.findIndex((c) => isSameConnection(payload, c));

			if (idx !== -1) state.splice(idx, 1);
		},
		toggleConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			const idx = state.findIndex((c) => isSameConnection(payload, c));

			if (idx !== -1) state.splice(idx, 1);
			else state.push(createConnection(state, payload));
		},
	},
	extraReducers(builder) {
		builder.addCase(removeAudioNode, (state, { payload: id }) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			state = stableWithout(getConnectionsFor(id, state), state);
		});
	},
});

function createConnection(
	state: AudioNodeConnection[],
	{ fromId, toId }: ConnectionIdent,
): AudioNodeConnection {
	return {
		fromId,
		toId,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		color: nodeColorPool[state.length % nodeColorPool.length]!,
	};
}

type ConnectionsState = AudioNodeConnection[];
