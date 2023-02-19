import { memo, useEffect } from "react";

import useModifierKeys from "~/app-store/hooks/use-modifier-keys";
import useAudioContext from "~/app-store/hooks/use-audio-context";

import AudioEffectsRack from "./audio-effects-rack";
import InstrumentsRack from "./instruments-rack";
import PatchBay from "./patch-bay";
import Masthead from "./masthead";

export default memo(function UI() {
	const { initAudioContext } = useAudioContext();
	const { registerKeyPress, registerKeyRelease } = useModifierKeys();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!globalThis.window) return undefined;

		const clickHandler = () => initAudioContext();

		globalThis.window.addEventListener("keydown", registerKeyPress, true);
		globalThis.window.addEventListener("keyup", registerKeyRelease, true);
		globalThis.window.addEventListener("click", clickHandler, {
			passive: true,
			once: true,
		});

		return () => {
			globalThis.window.removeEventListener("keydown", registerKeyPress, true);
			globalThis.window.removeEventListener("keyup", registerKeyRelease, true);
		};
	}, [registerKeyPress, registerKeyRelease, initAudioContext]);

	return (
		<div className="p-8 max-is-[92em] mli-auto mlb-0">
			<Masthead />
			<Divider />
			<InstrumentsRack />
			<Divider />
			<div className="flex flex-wrap">
				<div className="shrink grow">
					<AudioEffectsRack />
				</div>
				<div className="shrink-0 grow-0">
					<PatchBay />
				</div>
			</div>
		</div>
	);
});

function Divider() {
	return <div className="bg-text100 bs-[1px] mlb-4"></div>;
}
