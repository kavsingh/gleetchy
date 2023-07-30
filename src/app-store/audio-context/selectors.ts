import type { AppState } from "~/app-store/configure-store";

export function selectAudioContext(state: AppState) {
	return state.audioContext.audioContext;
}
