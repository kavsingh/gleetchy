import type { AppState } from "../configure-store";

export const selectIsPlaying = (state: AppState) =>
	state.globalPlayback.isPlaying;
