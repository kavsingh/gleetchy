import { createSlice } from "@reduxjs/toolkit";

import { getConnectionsFor, isSameConnection } from "#lib/audio";
import { stableWithout } from "#lib/util";
import { nodeColorPool } from "#style/color";

import { removeAudioNode } from "../audio-nodes/actions";
import { defaultNodes } from "../default-nodes";

import type { AudioNodeConnection, ConnectionIdent } from "#types";
import type { PayloadAction } from "@reduxjs/toolkit";

const [mainOut, loop0, loop1] = defaultNodes;
const initialState: ConnectionsState = [
	// oxlint-disable-next-line no-non-null-assertion
	{ fromId: loop0.id, toId: mainOut.id, color: nodeColorPool[0]! },
	// oxlint-disable-next-line no-non-null-assertion
	{ fromId: loop1.id, toId: mainOut.id, color: nodeColorPool[1]! },
];

export const connectionsSlice = createSlice({
	initialState,
	name: "connections",
	reducers: {
		addConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			if (!state.some((c) => isSameConnection(payload, c))) {
				state.push(createConnection(state, payload));
			}
		},
		removeConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			const idx = state.findIndex((c) => isSameConnection(payload, c));

			if (idx !== -1) state.splice(idx, 1);
		},
		toggleConnection(state, { payload }: PayloadAction<ConnectionIdent>) {
			const idx = state.findIndex((c) => isSameConnection(payload, c));

			if (idx === -1) state.push(createConnection(state, payload));
			else state.splice(idx, 1);
		},
	},
	extraReducers(builder) {
		builder.addCase(removeAudioNode, (state, { payload: id }) => {
			// oxlint-disable-next-line no-param-reassign
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
		// oxlint-disable-next-line no-non-null-assertion
		color: nodeColorPool[state.length % nodeColorPool.length]!,
	};
}

type ConnectionsState = AudioNodeConnection[];
