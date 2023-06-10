import type { AppState } from "~/app-store/configure-store";

export function selectTheme(state: AppState) {
	return state.ui.currentTheme;
}

export function selectModifierKeys(state: AppState) {
	return state.ui.modifierKeys;
}
