import { createSlice } from "@reduxjs/toolkit";

const initialState: AudioContextState = {};

export const audioContextSlice = createSlice({
	initialState,
	name: "audioContext",
	reducers: {
		initAudioContext: (state) => {
			const context = state.audioContext;

			if (!context || context.state === "closed") {
				state.audioContext = getAudioContext();

				return;
			}

			if (context.state === "suspended") void context.resume();
		},
	},
});

const getAudioContext = () => {
	if (!globalThis.document) throw new Error("Could not access dom");

	const AudioContext =
		// workaround for Safari
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
		globalThis.AudioContext || (globalThis as any).webkitAudioContext;

	if (!AudioContext) throw new Error("No audio context available");

	// NOTE: https://developer.chrome.com/blog/autoplay/#web-audio
	return new AudioContext();
};

interface AudioContextState {
	audioContext?: AudioContext;
}