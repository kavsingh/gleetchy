import { onCleanup } from "solid-js";

import useModifierKeys from "~/app-store/hooks/use-modifier-keys";

export default function KeyboardListeners() {
	const { registerKeyPress, registerKeyRelease } = useModifierKeys();

	globalThis.window.addEventListener("keydown", registerKeyPress, true);
	globalThis.window.addEventListener("keyup", registerKeyRelease, true);

	onCleanup(() => {
		globalThis.window.removeEventListener("keydown", registerKeyPress, true);
		globalThis.window.removeEventListener("keyup", registerKeyRelease, true);
	});

	return null;
}
