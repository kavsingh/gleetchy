import { createSlice } from "@reduxjs/toolkit";

import { loadAudioFile } from "./actions";

import type { AudioFile } from "~/types";

const initialState: AudioFilesState = {};

export const audioFilesSlice = createSlice({
	initialState,
	name: "audioFiles",
	reducers: {},
	extraReducers(builder) {
		builder.addCase(loadAudioFile.fulfilled, (state, action) => {
			state[action.payload.id] = Object.assign(
				state[action.payload.id] ?? {},
				action.payload,
			);
		});
	},
});

type AudioFilesState = Record<string, AudioFile>;
