import { createAsyncThunk } from "@reduxjs/toolkit";

import { selectAudioContext } from "../audio-context/selectors";

import { getFileId } from "./helpers";

import type { AudioFile } from "#types";
import type { AppState } from "../create";

export const loadAudioFileToNode = createAsyncThunk(
	"audioFiles/loadToNode",
	async function loadFileToNode(
		{ nodeId, file }: { nodeId: string; file: File },
		{ dispatch, getState },
	): Promise<{ nodeId: string; file: AudioFile }> {
		const state = getState() as AppState;
		const fileId = getFileId(file);
		const stored = state.audioFiles[fileId];

		if (stored) return { nodeId, file: stored };

		const loaded = (await dispatch(loadAudioFile(file))).payload as AudioFile;

		return { nodeId, file: loaded };
	},
);

export const loadAudioFile = createAsyncThunk(
	"audioFiles/decode",
	async function loadFile(file: File, { getState }): Promise<AudioFile> {
		const audioContext = selectAudioContext(getState() as AppState);

		if (!audioContext) throw new Error("No valid audio context");

		try {
			const id = getFileId(file);
			const { name, type } = file;
			const buffer = await audioContext.decodeAudioData(
				await file.arrayBuffer(),
			);

			return { id, name, type, buffer };
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

function errorFrom(value: unknown) {
	return value instanceof Error ? value : new Error(String(value));
}
