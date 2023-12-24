import { Show } from "solid-js";

import useGlobalPlayback from "#app-store/hooks/use-global-playback";
import Button from "#components/button";

export default function PlayPauseButton() {
	const { isPlaying, togglePlayback } = useGlobalPlayback();

	return (
		<Button tabIndex={0} onClick={togglePlayback} variant="text">
			<Show when={isPlaying()} fallback="Play">
				Stop
			</Show>
		</Button>
	);
}
