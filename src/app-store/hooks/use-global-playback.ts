import { useCallback } from "react";

import { togglePlayback as togglePlaybackAction } from "~/app-store/global-playback/actions";
import { selectIsPlaying } from "~/app-store/global-playback/selectors";

import { useAppDispatch, useAppSelector } from "./base";

const useGlobalPlayback = () => {
	const dispatch = useAppDispatch();
	const isPlaying = useAppSelector(selectIsPlaying);
	const togglePlayback = useCallback(
		() => dispatch(togglePlaybackAction()),
		[dispatch],
	);

	return { isPlaying, togglePlayback } as const;
};

export default useGlobalPlayback;
