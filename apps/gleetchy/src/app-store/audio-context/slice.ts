import { createSlice } from "@reduxjs/toolkit";

const initialState: AudioContextState = {};

export const audioContextSlice = createSlice({
	initialState,
	name: "audioContext",
	reducers: {
		initAudioContext(state) {
			const context = state.audioContext;

			if (!context || context.state === "closed") {
				state.audioContext = getAudioContext();

				return;
			}

			if (context.state === "suspended") void context.resume();
		},
	},
	selectors: {
		selectAudioContext(state) {
			return state.audioContext;
		},
	},
});

function getAudioContext() {
	const AudioContext =
		// workaround for Safari
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-condition
		globalThis.AudioContext || (globalThis as any).webkitAudioContext;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!AudioContext) throw new Error("No audio context available");

	// NOTE: https://developer.chrome.com/blog/autoplay/#web-audio
	return new AudioContext();
}

interface AudioContextState {
	audioContext?: AudioContext;
}
