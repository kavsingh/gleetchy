import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { AudioEngine, setupAudioEngineListeners } from "#audio";

import { audioContextSlice } from "./audio-context/slice";
import { publishSubscriptionEvent } from "./audio-engine/actions";
import { audioEngineSlice } from "./audio-engine/slice";
import { audioFilesSlice } from "./audio-files/slice";
import { audioNodesSlice } from "./audio-nodes/slice";
import { connectionsSlice } from "./connections/slice";
import { globalPlaybackSlice } from "./global-playback/slice";
import { appStartListening, listenerMiddleware } from "./listener-middleware";
import { uiSlice } from "./ui/slice";

const reducer = combineSlices(
	audioContextSlice,
	audioEngineSlice,
	globalPlaybackSlice,
	audioFilesSlice,
	audioNodesSlice,
	connectionsSlice,
	uiSlice,
);

export function createStore() {
	const store = configureStore({
		reducer,
		middleware(getDefaultMiddleware) {
			// TODO: revisit serializable check
			return getDefaultMiddleware({ serializableCheck: false }).prepend(
				listenerMiddleware.middleware,
			);
		},
		devTools: import.meta.env.DEV,
	});

	const audioEngine = new AudioEngine({
		publishSubscriptionEvent(nodeId: string, subscriptionPayload: unknown) {
			store.dispatch(publishSubscriptionEvent({ nodeId, subscriptionPayload }));
		},
	});

	const removeAudioEngineListeners = setupAudioEngineListeners(
		audioEngine,
		appStartListening,
	);

	function dispose() {
		removeAudioEngineListeners();
	}

	return { store, dispose };
}

export type AppStore = ReturnType<typeof createStore>["store"];
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
