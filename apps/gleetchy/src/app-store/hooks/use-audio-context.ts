import { initAudioContext as initAudioContextAction } from "../audio-context/actions";
import { selectAudioContext } from "../audio-context/selectors";

import { useAppDispatch, useAppSelector } from "./base";

export default function useAudioContext() {
	const dispatch = useAppDispatch();
	const audioContext = useAppSelector(selectAudioContext);

	function initAudioContext() {
		dispatch(initAudioContextAction());
	}

	return { audioContext, initAudioContext } as const;
}
