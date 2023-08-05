import type { AppState } from "../create";

export function selectIsPlaying(state: AppState) {
	return state.globalPlayback.isPlaying;
}
