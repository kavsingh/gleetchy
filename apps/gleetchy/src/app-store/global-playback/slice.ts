import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalPlaybackState = { isPlaying: false };

export const globalPlaybackSlice = createSlice({
	initialState,
	name: "globalPlayback",
	reducers: {
		togglePlayback(state) {
			state.isPlaying = !state.isPlaying;
		},
	},
	selectors: {
		selectIsPlaying(state) {
			return state.isPlaying;
		},
	},
});

interface GlobalPlaybackState {
	isPlaying: boolean;
}
