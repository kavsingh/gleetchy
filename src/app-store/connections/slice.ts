import { createSlice } from "@reduxjs/toolkit";

import { nodeColorPool } from "~/style/color";
import { stableWithout } from "~/lib/util";

import defaultNodes from "../default-nodes";
import { removeAudioNode } from "../audio-nodes/actions";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AudioNodeConnection } from "~/types";

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
		addConnection: (state, { payload: { fromId, toId } }: ConnectionAction) => {
			if (!state.find(connectionIs({ fromId, toId }))) {
				state.push(createConnection(state, { fromId, toId }));
			}
		},
		removeConnection: (
			state,
			{ payload: { fromId, toId } }: ConnectionAction,
		) => {
			const idx = state.findIndex(connectionIs({ fromId, toId }));

			if (idx !== -1) state.splice(idx, 1);
		},
		toggleConnection: (
			state,
			{ payload: { fromId, toId } }: ConnectionAction,
		) => {
			const idx = state.findIndex(connectionIs({ fromId, toId }));

			if (idx > -1) state.splice(idx, 1);
			else state.push(createConnection(state, { fromId, toId }));
		},
	},
	extraReducers: (builder) => {
		builder.addCase(removeAudioNode, (state, { payload: id }) => {
			state = stableWithout(
				state.filter(({ from, to }) => from === id || to === id),
				state,
			);
		});
	},
});

const createConnection = (
	state: AudioNodeConnection[],
	{ fromId, toId }: ConnectionDescriptor,
): AudioNodeConnection => ({
	from: fromId,
	to: toId,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	color: nodeColorPool[state.length % nodeColorPool.length]!,
});

const connectionIs =
	({ fromId, toId }: ConnectionDescriptor) =>
	(connection: AudioNodeConnection) =>
		connection.from === fromId && connection.to === toId;

type ConnectionsState = AudioNodeConnection[];

type ConnectionAction = PayloadAction<ConnectionDescriptor>;

interface ConnectionDescriptor {
	fromId: string;
	toId: string;
}
