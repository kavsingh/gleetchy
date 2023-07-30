import type { AppState } from "../configure-store";

export function selectIsPlaying(state: AppState) {
	return state.globalPlayback.isPlaying;
}
