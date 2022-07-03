import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";

import type { AppState, AppDispatch } from "./configure-store";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";

export const listenerMiddleware = createListenerMiddleware();

export const appAddListener = addListener as TypedAddListener<
	AppState,
	AppDispatch
>;

export const appStartListening =
	listenerMiddleware.startListening as AppStartListening;

export type AppStartListening = TypedStartListening<AppState, AppDispatch>;
