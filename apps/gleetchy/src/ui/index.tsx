import AudioEffectsRack from "./audio-effects-rack";
import AudioInitListeners from "./audio-init-listeners";
import InstrumentsRack from "./instruments-rack";
import KeyboardListeners from "./keyboard-listeners";
import Masthead from "./masthead";
import PatchBay from "./patch-bay";
import ThemeEffects from "./theme-effects";

export default function UI() {
	return (
		<>
			<AudioInitListeners />
			<ThemeEffects />
			<KeyboardListeners />
			<div class="mx-auto my-0 max-w-[92em] p-8">
				<Masthead />
				<Divider />
				<InstrumentsRack />
				<Divider />
				<div class="flex flex-wrap">
					<div class="shrink grow">
						<AudioEffectsRack />
					</div>
					<div class="shrink-0 grow-0">
						<PatchBay />
					</div>
				</div>
			</div>
		</>
	);
}

function Divider() {
	return <hr class="mx-0 my-4 border-text100 p-0" />;
}
