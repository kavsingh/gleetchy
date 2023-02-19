import { themes } from "~/style/theme";

import type { AppState } from "~/app-store/configure-store";

export function selectThemeName(state: AppState) {
	return state.ui.currentThemeName;
}

export function selectTheme(state: AppState) {
	return themes[state.ui.currentThemeName];
}

export function selectModifierKeys(state: AppState) {
	return state.ui.modifierKeys;
}
