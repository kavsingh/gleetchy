import { createAsyncThunk } from "@reduxjs/toolkit";
import { pick } from "ramda";

import {
	readFileToArrayBuffer,
	loadAudioFilesToArrayBuffers,
} from "~/apis/file";

import { selectAudioContext } from "../audio-context/selectors";

import type { AppState } from "../configure-store";
import type { AudioFileData, DecodedAudioFileData } from "~/types";

export const selectAudioFile = createAsyncThunk(
	"audioFiles/select",
	async ({ id }: SelectAudioFileArg, { dispatch, getState }) => {
		const audioContext = selectAudioContext(getState() as AppState);

		if (!audioContext) return;

		try {
			const [file] = await loadAudioFilesToArrayBuffers();

			if (!file) throw new Error("No file loaded");

			const result = { id, file };

			void dispatch(decodeAudioFile({ ...result }));

			return result;
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

export const receiveAudioFile = createAsyncThunk(
	"audioFiles/receive",
	async ({ id, file }: ReceiveAudioFileArg, { dispatch, getState }) => {
		const audioContext = selectAudioContext(getState() as AppState);

		if (!audioContext) return;

		try {
			const fileData = await readFileToArrayBuffer(file);
			const result = { id, file: fileData };

			void dispatch(decodeAudioFile({ ...result }));

			return result;
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

export const decodeAudioFile = createAsyncThunk(
	"audioFiles/decode",
	async (
		{ id, file }: DecodeAudioFileArg,
		{ getState },
	): Promise<DecodeAudioFileReturn | undefined> => {
		const audioContext = selectAudioContext(getState() as AppState);

		if (!audioContext) return;

		try {
			const audioBuffer = await audioContext.decodeAudioData(file.buffer);

			return {
				id,
				file: { ...pick(["fileName", "fileType"], file), audioBuffer },
			};
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

const errorFrom = (value: unknown) =>
	value instanceof Error ? value : new Error(String(value));

interface SelectAudioFileArg {
	id: string;
}

interface ReceiveAudioFileArg {
	id: string;
	file: File;
}

interface DecodeAudioFileArg {
	id: string;
	file: AudioFileData;
}

interface DecodeAudioFileReturn {
	id: string;
	file: DecodedAudioFileData;
}
