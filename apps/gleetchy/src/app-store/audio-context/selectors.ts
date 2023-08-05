import type { AppState } from "~/app-store/create";

export function selectAudioContext(state: AppState) {
	return state.audioContext.audioContext;
}
