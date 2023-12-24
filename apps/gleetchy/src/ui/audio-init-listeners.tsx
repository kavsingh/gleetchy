import { onCleanup } from "solid-js";

import useAudioContext from "#app-store/hooks/use-audio-context";

export default function AudioInitListeners() {
	const { initAudioContext } = useAudioContext();

	globalThis.window.addEventListener("click", initAudioContext, {
		passive: true,
		once: true,
	});

	onCleanup(() => {
		globalThis.window.removeEventListener("click", initAudioContext, true);
	});

	return null;
}
