import type { AppState } from "../configure-store";

export const selectAudioEngineSubscriptionData = (state: AppState) =>
	state.audioEngine.subscriptionData;
