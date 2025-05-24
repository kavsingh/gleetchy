import { createMemo } from "solid-js";

import { MODIFIER_KEYS } from "#lib/constants";
import { ui } from "#stores/ui";

export default function useControlResponseMultiplier(
	props: ControlResponseMultipliers,
) {
	const multiplier = createMemo(() =>
		ui.activeKeys.includes(MODIFIER_KEYS.Shift) ? props.fine : props.normal,
	);

	return multiplier;
}

export interface ControlResponseMultipliers {
	normal: number;
	fine: number;
}
