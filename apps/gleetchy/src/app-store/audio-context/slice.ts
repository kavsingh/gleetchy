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
	let { AudioContext } = globalThis;

	// workaround for Safari
	if (!AudioContext) {
		// oxlint-disable-next-line typescript/no-unsafe-assignment, typescript/no-unsafe-type-assertion, typescript/no-explicit-any, typescript/no-unsafe-member-access
		AudioContext = (globalThis as any).webkitAudioContext;
	}

	if (!AudioContext) throw new Error("No audio context available");

	// NOTE: https://developer.chrome.com/blog/autoplay/#web-audio
	return new AudioContext();
}

interface AudioContextState {
	audioContext?: AudioContext;
}
