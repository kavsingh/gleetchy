import { createSlice } from "@reduxjs/toolkit";

import { getPreferredColorScheme } from "~/apis/color-scheme";
import { MODIFIER_KEYS } from "~/lib/constants";
import { stableAppendUnique, stableWithout } from "~/lib/util";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { ModifierKey } from "~/lib/constants";

function getInitialTheme(): Theme {
	const preferred = getPreferredColorScheme();

	if (preferred === "system") return "dark";

	return preferred === "light" ? "light" : "dark";
}

const initialState: UIState = {
	currentTheme: getInitialTheme(),
	modifierKeys: [],
};

export const uiSlice = createSlice({
	initialState,
	name: "ui",
	reducers: {
		setDarkTheme: (state) => {
			state.currentTheme = "dark";
		},
		setLightTheme: (state) => {
			state.currentTheme = "light";
		},
		toggleTheme: (state) => {
			state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
		},
		registerKeyPress: (state, action: PayloadAction<string>) => {
			const key = action.payload;

			if (!isModifierKey(key)) return;

			state.modifierKeys = stableAppendUnique([key], state.modifierKeys);
		},
		registerKeyRelease: (state, action: PayloadAction<string>) => {
			state.modifierKeys = stableWithout<ModifierKey>(
				[action.payload as ModifierKey],
				state.modifierKeys,
			);
		},
	},
});

function isModifierKey(key: string): key is ModifierKey {
	return Object.values(MODIFIER_KEYS).includes(key as ModifierKey);
}

type UIState = {
	currentTheme: Theme;
	modifierKeys: ModifierKey[];
};

type Theme = "dark" | "light";
