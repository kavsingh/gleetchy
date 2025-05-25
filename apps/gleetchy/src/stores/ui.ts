import { createStore, produce } from "solid-js/store";

const [store, setStore] = createStore<UiState>({
	theme: "system",
	activeKeys: [],
});

export { store as ui };

export function setTheme(theme: Theme) {
	setStore("theme", theme);
}

export function registerKeyPress({ key }: KeyboardEvent) {
	setStore(
		produce((draft) => {
			if (!draft.activeKeys.includes(key)) draft.activeKeys.push(key);
		}),
	);
}

export function registerKeyRelease({ key }: KeyboardEvent) {
	setStore(
		produce((draft) => {
			const idx = draft.activeKeys.indexOf(key);

			if (idx !== -1) draft.activeKeys.splice(idx, 1);
		}),
	);
}

interface UiState {
	theme: Theme;
	activeKeys: string[];
}

export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];
