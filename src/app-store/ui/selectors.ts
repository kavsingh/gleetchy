import type { AppState } from "~/app-store/create";

export function selectTheme(state: AppState) {
	return state.ui.currentTheme;
}

export function selectModifierKeys(state: AppState) {
	return state.ui.modifierKeys;
}
