import type { AppState } from "../create";

export function selectAudioFile(state: AppState, fileId: string) {
	return state.audioFiles[fileId];
}
