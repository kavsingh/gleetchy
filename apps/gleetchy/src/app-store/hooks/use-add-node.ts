import { addAudioNode } from "#app-store/audio-nodes/actions";

import { useAppDispatch } from "./base";

export function useAddNode() {
	const dispatch = useAppDispatch();

	return function addNode(type: string) {
		dispatch(addAudioNode(type));
	};
}
