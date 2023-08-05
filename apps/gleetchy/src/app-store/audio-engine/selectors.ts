import type { AppState } from "../create";

export function selectAudioEngineSubscriptionData(state: AppState) {
	return state.audioEngine.subscriptionData;
}
