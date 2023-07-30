import { useRef, useEffect } from "react";

import useModifierKeys from "~/app-store/hooks/use-modifier-keys";
import { MODIFIER_KEYS } from "~/lib/constants";

import type { MutableRefObject } from "react";

export default function useControlResponseRef({
	normal,
	fine,
}: ControlResponseMultipliers): MutableRefObject<number> {
	const { activeKeys } = useModifierKeys();
	const multiplierRef = useRef(normal);

	useEffect(() => {
		multiplierRef.current = activeKeys.includes(MODIFIER_KEYS.Shift)
			? fine
			: normal;
	}, [activeKeys, normal, fine]);

	return multiplierRef;
}

export type ControlResponseMultipliers = {
	normal: number;
	fine: number;
};
