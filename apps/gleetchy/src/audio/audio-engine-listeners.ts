import type { AppStartListening } from "#app-store/listener-middleware";
import type AudioEngine from "./audio-engine";

export const setupAudioEngineListeners = (
	audioEngine: AudioEngine,
	startListening: AppStartListening,
) => {
	const removeStateUpdatesListener = startListening({
		predicate: () => true,
		effect: (action, listenerApi) => {
			void audioEngine.update(listenerApi.getState(), action);
		},
	});

	return () => {
		removeStateUpdatesListener();
	};
};
