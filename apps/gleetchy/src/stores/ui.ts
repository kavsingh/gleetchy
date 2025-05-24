import { createStore } from "solid-js/store";

import { stableAppendUnique, stableWithout } from "#lib/util";

const [store, setStore] = createStore<UiState>({
	theme: "system",
	activeKeys: [],
});

export { store as ui };

export function setTheme(theme: Theme) {
	setStore("theme", theme);
}

export function registerKeyPress(event: KeyboardEvent) {
	setStore("activeKeys", (prev) => {
		return stableAppendUnique([event.key], prev);
	});
}

export function registerKeyRelease(event: KeyboardEvent) {
	setStore("activeKeys", (prev) => {
		return stableWithout([event.key], prev);
	});
}

interface UiState {
	theme: Theme;
	activeKeys: string[];
}

export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];
