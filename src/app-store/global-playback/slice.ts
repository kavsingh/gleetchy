import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalPlaybackState = { isPlaying: false };

export const globalPlaybackSlice = createSlice({
	initialState,
	name: "globalPlayback",
	reducers: {
		togglePlayback: (state) => {
			state.isPlaying = !state.isPlaying;
		},
	},
});

type GlobalPlaybackState = {
	isPlaying: boolean;
};
