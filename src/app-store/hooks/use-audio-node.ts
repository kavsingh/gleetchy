import { deepEqual } from "fast-equals";
import { createMemo } from "solid-js";

import {
	updateAudioNodeProps,
	updateAudioNodeLabel,
	duplicateAudioNode,
	removeAudioNode,
} from "~/app-store/audio-nodes/actions";
import { getConnectionsFor } from "~/lib/audio";

import { useAppDispatch, useAppSelector } from "./base";
import {
	selectAudioNodes,
	selectActiveAudioNodeIds,
} from "../audio-nodes/selectors";
import { selectConnections } from "../connections/selectors";

import type { AudioNodeState } from "~/types";

export default function useAudioNode<T extends Record<string, unknown>>(
	id: string,
	isValid: ReturnType<typeof validateNodeType>,
) {
	const node = useAppSelector((state) => {
		const selected = selectAudioNodes(state)[id] as
			| AudioNodeState<T>
			| undefined;
		// please forgive me
		if (!selected) throw new Error(`No node found for ${id}`);
		if (!isValid(selected)) throw new Error(`Node ${id} has invalid type`);

		return selected;
	}, deepEqual);

	const dispatch = useAppDispatch();
	const allConnections = useAppSelector(selectConnections);
	const label = createMemo(() => node().label);
	const audioProps = createMemo(() => node().audioProps);

	const isActive = useAppSelector((state) => {
		return selectActiveAudioNodeIds(state).includes(id);
	});

	const connections = createMemo(
		() => getConnectionsFor(node().id, allConnections()),
		{ equals: deepEqual },
	);

	function duplicate() {
		dispatch(duplicateAudioNode(id));
	}

	function remove() {
		dispatch(removeAudioNode(id));
	}

	function updateAudioProps(next: Partial<T>) {
		dispatch(updateAudioNodeProps({ id, audioProps: next }));
	}

	function updateLabel(next: string) {
		dispatch(updateAudioNodeLabel({ id, label: next }));
	}

	return {
		connections,
		isActive,
		updateAudioProps,
		updateLabel,
		duplicate,
		remove,
		label,
		audioProps,
	} as const;
}

export function validateNodeType(
	type: AudioNodeState<Record<string, unknown>>["type"],
) {
	return function validate(
		node?: AudioNodeState<Record<string, unknown>> | undefined,
	) {
		return node?.type === type;
	};
}
