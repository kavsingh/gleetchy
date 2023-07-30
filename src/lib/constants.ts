export const MODIFIER_KEYS = {
	Shift: "Shift",
} as const;

export type ModifierKey = (typeof MODIFIER_KEYS)[keyof typeof MODIFIER_KEYS];
