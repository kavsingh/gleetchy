import { useAppDispatch, useAppSelector } from "./base";
import { initAudioContext as initAudioContextAction } from "../audio-context/actions";
import { selectAudioContext } from "../audio-context/selectors";

export default function useAudioContext() {
	const dispatch = useAppDispatch();
	const audioContext = useAppSelector(selectAudioContext);

	function initAudioContext() {
		dispatch(initAudioContextAction());
	}

	return { audioContext, initAudioContext } as const;
}
