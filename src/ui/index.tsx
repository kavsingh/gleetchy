import { memo } from "react";

import AudioEffectsRack from "./audio-effects-rack";
import InstrumentsRack from "./instruments-rack";
import KeyboardListeners from "./keyboard-listeners";
import Masthead from "./masthead";
import PatchBay from "./patch-bay";
import ThemeEffects from "./theme-effects";

export default memo(function UI() {
	return (
		<>
			<ThemeEffects />
			<KeyboardListeners />
			<div className="mx-auto my-0 max-w-[92em] p-8">
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
		</>
	);
});

function Divider() {
	return <hr className="mx-0 my-4 border-text100 p-0" />;
}
