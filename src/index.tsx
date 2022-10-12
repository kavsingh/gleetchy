import { createRoot } from "react-dom/client";

import { createStore } from "~/app-store/configure-store";

import App from "./app";

if (!globalThis.document) throw new Error("Could not access dom");

const appRoot = globalThis.document.getElementById("app-root");

if (!appRoot) throw new Error("Could not find app mount at #app-root");

const reactRoot = createRoot(appRoot);
const { ssrInitialState } = appRoot.dataset;

delete appRoot.dataset.ssrInitialState;

const parsedState: unknown = JSON.parse(ssrInitialState || "{}");
const initialState =
	parsedState && typeof parsedState === "object" && !Array.isArray(parsedState)
		? parsedState
		: {};
const { store } = createStore(initialState);

reactRoot.render(<App store={store} />);
