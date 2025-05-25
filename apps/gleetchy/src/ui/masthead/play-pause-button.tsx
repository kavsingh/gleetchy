import { Show } from "solid-js";

import Button from "#components/button";
import { globalTransport, togglePlayback } from "#stores/global-transport";

export default function PlayPauseButton() {
	return (
		<Button tabIndex={0} onClick={togglePlayback} variant="text">
			<Show when={globalTransport.isPlaying} fallback="Play">
				Stop
			</Show>
		</Button>
	);
}
