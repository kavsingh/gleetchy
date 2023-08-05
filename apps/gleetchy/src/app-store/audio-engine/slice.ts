import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: AudioEngineState = { subscriptionData: {} };

export const audioEngineSlice = createSlice({
	initialState,
	name: "audioEngine",
	reducers: {
		publishSubscriptionEvent(
			state,
			{
				payload: { nodeId, subscriptionPayload },
			}: PayloadAction<{ nodeId: string; subscriptionPayload: unknown }>,
		) {
			state.subscriptionData[nodeId] = Object.assign(
				state.subscriptionData[nodeId] ?? {},
				subscriptionPayload,
			);
		},
	},
});

type AudioEngineState = {
	subscriptionData: Record<string, Record<string, unknown>>;
};
