import { createMemo } from "solid-js";

import { useModifierKeys } from "#app-store/hooks/use-modifier-keys";
import { MODIFIER_KEYS } from "#lib/constants";

export function useControlResponseMultiplier(
	props: ControlResponseMultipliers,
) {
	const { activeKeys } = useModifierKeys();
	const multiplier = createMemo(() =>
		activeKeys().includes(MODIFIER_KEYS.Shift) ? props.fine : props.normal,
	);

	return multiplier;
}

export interface ControlResponseMultipliers {
	normal: number;
	fine: number;
}
