import {
	registerKeyPress as registerKeyPressAction,
	registerKeyRelease as registerKeyReleaseAction,
} from "../ui/actions";
import { selectModifierKeys } from "../ui/selectors";

import { useAppDispatch, useAppSelector } from "./base";

export function useModifierKeys() {
	const dispatch = useAppDispatch();
	const activeKeys = useAppSelector(selectModifierKeys);

	function registerKeyPress(event: KeyboardEvent) {
		dispatch(registerKeyPressAction(event.key));
	}

	function registerKeyRelease(event: KeyboardEvent) {
		dispatch(registerKeyReleaseAction(event.key));
	}

	return { activeKeys, registerKeyPress, registerKeyRelease } as const;
}
