import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "./base";
import { initAudioContext as initAudioContextAction } from "../audio-context/actions";
import { selectAudioContext } from "../audio-context/selectors";

export default function useAudioContext() {
	const dispatch = useAppDispatch();
	const audioContext = useAppSelector(selectAudioContext);

	const initAudioContext = useCallback(() => {
		dispatch(initAudioContextAction());
	}, [dispatch]);

	return { audioContext, initAudioContext } as const;
}
