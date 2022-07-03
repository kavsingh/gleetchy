import { useRef, useEffect } from "react";

import { ModifierKey } from "~/lib/constants";
import useModifierKeys from "~/app-store/hooks/use-modifier-keys";

import type { MutableRefObject } from "react";

export interface ControlResponseMultipliers {
	normal: number;
	fine: number;
}

const useControlResponseRef = ({
	normal,
	fine,
}: ControlResponseMultipliers): MutableRefObject<number> => {
	const { activeKeys } = useModifierKeys();
	const multiplierRef = useRef(normal);

	useEffect(() => {
		multiplierRef.current = activeKeys.includes(ModifierKey.Shift)
			? fine
			: normal;
	}, [activeKeys, normal, fine]);

	return multiplierRef;
};

export default useControlResponseRef;
