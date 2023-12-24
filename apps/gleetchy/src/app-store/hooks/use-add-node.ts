import { addAudioNode } from "#app-store/audio-nodes/actions";

import { useAppDispatch } from "./base";

export default function useAddNode() {
	const dispatch = useAppDispatch();

	return function addNode(type: string) {
		dispatch(addAudioNode(type));
	};
}
