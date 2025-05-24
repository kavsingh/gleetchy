import { onCleanup } from "solid-js";

import { registerKeyPress, registerKeyRelease } from "#stores/ui";

export default function KeyboardListeners() {
	globalThis.window.addEventListener("keydown", registerKeyPress, true);
	globalThis.window.addEventListener("keyup", registerKeyRelease, true);

	onCleanup(() => {
		globalThis.window.removeEventListener("keydown", registerKeyPress, true);
		globalThis.window.removeEventListener("keyup", registerKeyRelease, true);
	});

	return null;
}
