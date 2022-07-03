import { themes } from "~/style/theme";

import type { AppState } from "~/app-store/configure-store";

export const selectThemeName = (state: AppState) => state.ui.currentThemeName;

export const selectTheme = (state: AppState) =>
	themes[state.ui.currentThemeName];

export const selectModifierKeys = (state: AppState) => state.ui.modifierKeys;
