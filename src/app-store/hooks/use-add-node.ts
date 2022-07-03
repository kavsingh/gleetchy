import { useCallback } from "react";

import { addAudioNode } from "~/app-store/audio-nodes/actions";

import { useAppDispatch } from "./base";

const useAddNode = () => {
	const dispatch = useAppDispatch();
	const addNode = useCallback(
		(type: string) => dispatch(addAudioNode(type)),
		[dispatch],
	);

	return { addNode } as const;
};

export default useAddNode;
