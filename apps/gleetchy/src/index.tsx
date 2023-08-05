import { render } from "solid-js/web";

import { createStore } from "~/app-store/create";

import "./index.css";
import App from "./app";

const appRoot = globalThis.document.getElementById("app-root");

if (!appRoot) throw new Error("Could not find app mount at #app-root");

render(() => <App store={createStore().store} />, appRoot);
