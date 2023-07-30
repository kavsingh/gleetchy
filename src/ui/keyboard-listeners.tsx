import { memo, useEffect } from "react";

import useAudioContext from "~/app-store/hooks/use-audio-context";
import useModifierKeys from "~/app-store/hooks/use-modifier-keys";

export default memo(function KeyboardListeners() {
	const { initAudioContext } = useAudioContext();
	const { registerKeyPress, registerKeyRelease } = useModifierKeys();

	useEffect(() => {
		globalThis.window.addEventListener("keydown", registerKeyPress, true);
		globalThis.window.addEventListener("keyup", registerKeyRelease, true);
		globalThis.window.addEventListener("click", initAudioContext, {
			passive: true,
			once: true,
		});

		return () => {
			globalThis.window.removeEventListener("keydown", registerKeyPress, true);
			globalThis.window.removeEventListener("keyup", registerKeyRelease, true);
			globalThis.window.removeEventListener("click", initAudioContext, true);
		};
	}, [registerKeyPress, registerKeyRelease, initAudioContext]);

	return null;
});
