import { configureStore } from "@reduxjs/toolkit";

import { AudioEngine, setupAudioEngineListeners } from "~/audio";

import { audioContextSlice } from "./audio-context/slice";
import { publishSubscriptionEvent } from "./audio-engine/actions";
import { audioEngineSlice } from "./audio-engine/slice";
import { audioFilesSlice } from "./audio-files/slice";
import { audioNodesSlice } from "./audio-nodes/slice";
import { connectionsSlice } from "./connections/slice";
import { globalPlaybackSlice } from "./global-playback/slice";
import { appStartListening, listenerMiddleware } from "./listener-middleware";
import { uiSlice } from "./ui/slice";

import type { StateFromReducersMapObject } from "@reduxjs/toolkit";

const reducer = {
	[audioContextSlice.name]: audioContextSlice.reducer,
	[audioEngineSlice.name]: audioEngineSlice.reducer,
	[globalPlaybackSlice.name]: globalPlaybackSlice.reducer,
	[audioFilesSlice.name]: audioFilesSlice.reducer,
	[audioNodesSlice.name]: audioNodesSlice.reducer,
	[connectionsSlice.name]: connectionsSlice.reducer,
	[uiSlice.name]: uiSlice.reducer,
} as const;

export function createStore(
	preloadedState: Partial<StateFromReducersMapObject<typeof reducer>> = {},
) {
	const store = configureStore({
		reducer,
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			// TODO: revisit serializable check
			getDefaultMiddleware({ serializableCheck: false }).prepend(
				listenerMiddleware.middleware,
			),
		devTools: import.meta.env.DEV,
	});

	const audioEngine = new AudioEngine({
		publishSubscriptionEvent: (nodeId: string, subscriptionPayload: unknown) =>
			store.dispatch(publishSubscriptionEvent({ nodeId, subscriptionPayload })),
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
