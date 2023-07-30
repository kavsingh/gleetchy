import type { AppState } from "../configure-store";

export function selectAudioEngineSubscriptionData(state: AppState) {
	return state.audioEngine.subscriptionData;
}
