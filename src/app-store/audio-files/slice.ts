import {
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from "@reduxjs/toolkit";

import { stableAppendUnique, stableOmit, stableWithout } from "~/lib/util";

import { decodeAudioFile, receiveAudioFile, selectAudioFile } from "./actions";

import type { SerializedError } from "@reduxjs/toolkit";
import type { AudioFileData, DecodedAudioFileData } from "~/types";

const initialState: AudioFilesState = {
	decodeErrors: {},
	decodingIds: [],
	files: {},
	loadErrors: {},
	loadingIds: [],
};

export const audioFilesSlice = createSlice({
	initialState,
	name: "audioFiles",
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(decodeAudioFile.pending, (state, action) => {
			state.decodingIds = stableAppendUnique(
				[action.meta.arg.id],
				state.decodingIds,
			);
			state.decodeErrors = stableOmit([action.meta.arg.id], state.decodeErrors);
		});

		builder.addCase(decodeAudioFile.rejected, (state, action) => {
			state.decodingIds = stableWithout(
				[action.meta.arg.id],
				state.decodingIds,
			);
			state.loadErrors[action.meta.arg.id] = action.error;
		});

		builder.addCase(decodeAudioFile.fulfilled, (state, action) => {
			if (!action.payload) return;

			state.decodingIds = stableWithout([action.payload.id], state.decodingIds);
			state.files[action.payload.id] = Object.assign(
				state.files[action.payload.id] ?? {},
				action.payload.file,
			);
		});

		builder.addMatcher(
			isPending(selectAudioFile, receiveAudioFile),
			(state, action) => {
				state.loadingIds = stableAppendUnique(
					[action.meta.arg.id],
					state.loadingIds,
				);
				state.loadErrors = stableOmit([action.meta.arg.id], state.loadErrors);
			},
		);

		builder.addMatcher(
			isRejected(selectAudioFile, receiveAudioFile),
			(state, action) => {
				state.loadingIds = stableWithout(
					[action.meta.arg.id],
					state.loadingIds,
				);
				state.loadErrors[action.meta.arg.id] = action.error;
			},
		);

		builder.addMatcher(
			isFulfilled(selectAudioFile, receiveAudioFile),
			(state, action) => {
				if (!action.payload) return;

				const { buffer: _, ...rest } = action.payload.file;

				state.loadingIds = stableWithout([action.payload.id], state.loadingIds);
				state.files[action.payload.id] = Object.assign(
					state.files[action.payload.id] ?? {},
					rest,
				);
			},
		);
	},
});

interface AudioFilesState {
	decodeErrors: Record<string, SerializedError>;
	decodingIds: string[];
	files: Record<string, StoredAudioFileData>;
	loadErrors: Record<string, SerializedError>;
	loadingIds: string[];
}

interface StoredAudioFileData extends Omit<AudioFileData, "buffer"> {
	buffer?: DecodedAudioFileData["audioBuffer"];
}
