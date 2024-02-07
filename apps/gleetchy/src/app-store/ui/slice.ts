import { createSlice } from "@reduxjs/toolkit";

import { MODIFIER_KEYS } from "#lib/constants";
import { stableAppendUnique, stableWithout } from "#lib/util";

import type { ModifierKey } from "#lib/constants";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: UIState = {
	currentTheme: "system",
	modifierKeys: [],
};

export const uiSlice = createSlice({
	initialState,
	name: "ui",
	reducers: {
		setTheme(state, action: PayloadAction<Theme>) {
			state.currentTheme = action.payload;
		},
		registerKeyPress(state, action: PayloadAction<string>) {
			const key = action.payload;

			if (!isModifierKey(key)) return;

			state.modifierKeys = stableAppendUnique([key], state.modifierKeys);
		},
		registerKeyRelease(state, action: PayloadAction<string>) {
			state.modifierKeys = stableWithout<ModifierKey>(
				[action.payload as ModifierKey],
				state.modifierKeys,
			);
		},
	},
	selectors: {
		selectTheme(state) {
			return state.currentTheme;
		},
		selectModifierKeys(state) {
			return state.modifierKeys;
		},
	},
});

export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

function isModifierKey(key: string): key is ModifierKey {
	return Object.values(MODIFIER_KEYS).includes(key as ModifierKey);
}

type UIState = {
	currentTheme: Theme;
	modifierKeys: ModifierKey[];
};
