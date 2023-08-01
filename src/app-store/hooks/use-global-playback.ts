import { togglePlayback as togglePlaybackAction } from "~/app-store/global-playback/actions";
import { selectIsPlaying } from "~/app-store/global-playback/selectors";

import { useAppDispatch, useAppSelector } from "./base";

export default function useGlobalPlayback() {
	const dispatch = useAppDispatch();
	const isPlaying = useAppSelector(selectIsPlaying);

	function togglePlayback() {
		dispatch(togglePlaybackAction());
	}

	return { isPlaying, togglePlayback } as const;
}
