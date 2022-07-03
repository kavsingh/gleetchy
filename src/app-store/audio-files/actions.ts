import { createAsyncThunk } from "@reduxjs/toolkit";
import { head, pick } from "ramda";

import {
	readFileToArrayBuffer,
	loadAudioFilesToArrayBuffers,
} from "~/apis/file";

import type { AudioFileData, DecodedAudioFileData } from "~/types";

export const selectAudioFile = createAsyncThunk(
	"audioFiles/select",
	async ({ id, audioContext }: SelectAudioFileArg, { dispatch }) => {
		try {
			const file = head(await loadAudioFilesToArrayBuffers());

			if (!file) throw new Error("No file loaded");
			const result = { id, file };

			void dispatch(decodeAudioFile({ ...result, audioContext }));

			return result;
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

export const receiveAudioFile = createAsyncThunk(
	"audioFiles/receive",
	async ({ id, file, audioContext }: ReceiveAudioFileArg, { dispatch }) => {
		try {
			const fileData = await readFileToArrayBuffer(file);
			const result = { id, file: fileData };

			void dispatch(decodeAudioFile({ ...result, audioContext }));

			return result;
		} catch (e) {
			throw errorFrom(e);
		}
	},
);

export const decodeAudioFile = createAsyncThunk(
	"audioFiles/decode",
	async ({
		id,
		file,
		audioContext,
	}: DecodeAudioFileArg): Promise<DecodeAudioFileReturn> => {
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
	audioContext: AudioContext;
}

interface ReceiveAudioFileArg {
	id: string;
	file: File;
	audioContext: AudioContext;
}

interface DecodeAudioFileArg {
	id: string;
	file: AudioFileData;
	audioContext: AudioContext;
}

interface DecodeAudioFileReturn {
	id: string;
	file: DecodedAudioFileData;
}
