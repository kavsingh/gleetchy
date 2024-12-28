import { deepEqual } from "fast-equals";
import { createMemo } from "solid-js";

import {
	updateAudioNodeProps,
	updateAudioNodeLabel,
	duplicateAudioNode,
	removeAudioNode,
} from "#app-store/audio-nodes/actions";
import { getConnectionsFor } from "#lib/audio";

import { selectAudioNodes } from "../audio-nodes/selectors";
import {
	selectActiveAudioNodeIds,
	selectConnections,
} from "../connections/selectors";

import { useAppDispatch, useAppSelector } from "./base";

import type { AudioNodeState } from "#types";

export default function useAudioNode<
	TAudioNodeProps extends Record<string, unknown>,
>(id: string, isValid: ReturnType<typeof validateNodeType>) {
	const node = useAppSelector((state) => {
		const selected = selectAudioNodes(state)[id];

		return selected && isValid(selected) ? selected : undefined;
	}, deepEqual);

	const dispatch = useAppDispatch();
	const allConnections = useAppSelector(selectConnections);
	const label = createMemo(() => node()?.label);
	const audioProps = createMemo(() => {
		const nodeAudioProps = node()?.audioProps;

		if (!nodeAudioProps) return undefined;

		return nodeAudioProps as Extract<typeof nodeAudioProps, TAudioNodeProps>;
	});

	const isActive = useAppSelector((state) => {
		return selectActiveAudioNodeIds(state).includes(id);
	});

	const connections = createMemo(
		() => {
			const reified = node();

			return reified ? getConnectionsFor(reified.id, allConnections()) : [];
		},
		{ equals: deepEqual },
	);

	function duplicate() {
		dispatch(duplicateAudioNode(id));
	}

	function remove() {
		dispatch(removeAudioNode(id));
	}

	function updateAudioProps(next: Partial<TAudioNodeProps>) {
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
	return function validate(node?: AudioNodeState<Record<string, unknown>>) {
		return node?.type === type;
	};
}
