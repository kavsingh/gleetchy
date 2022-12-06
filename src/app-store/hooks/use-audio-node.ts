import { useCallback, useEffect, useState } from "react";
import { isEqual } from "lodash";

import {
	updateAudioNodeProps,
	updateAudioNodeLabel,
	duplicateAudioNode,
	removeAudioNode,
} from "~/app-store/audio-nodes/actions";
import { getConnectionsFor } from "~/lib/audio";

import {
	selectAudioNodes,
	selectActiveAudioNodeIds,
} from "../audio-nodes/selectors";
import { selectConnections } from "../connections/selectors";
import { useAppDispatch, useAppSelector } from "./base";

import type { AudioNodeState, AudioNodeConnection } from "~/types";

const useAudioNode = <T extends Record<string, unknown>>(
	id: string,
	isValid: AudioNodeStateValidator,
) => {
	const node = useAppSelector(
		(state) => selectAudioNodes(state)[id] as AudioNodeState<T> | undefined,
		isEqual,
	);

	if (!node) throw new Error(`Audio node not found at id ${id}`);

	if (!isValid(node)) throw new Error(`Audio node is invalid for ${id}`);

	const isActive = useAppSelector((state) =>
		selectActiveAudioNodeIds(state).includes(node.id),
	);
	const allConnections = useAppSelector(selectConnections);
	const dispatch = useAppDispatch();

	const [connections, setConnections] = useState<AudioNodeConnection[]>([]);

	const duplicate = useCallback(
		() => dispatch(duplicateAudioNode(id)),
		[id, dispatch],
	);

	const remove = useCallback(
		() => dispatch(removeAudioNode(id)),
		[id, dispatch],
	);

	const updateAudioProps = useCallback(
		(audioProps: Partial<T>) =>
			dispatch(updateAudioNodeProps({ id, audioProps })),
		[id, dispatch],
	);

	const updateLabel = useCallback(
		(label: string) => dispatch(updateAudioNodeLabel({ id, label })),
		[id, dispatch],
	);

	useEffect(() => {
		setConnections((current) => {
			const next = getConnectionsFor(id, allConnections);

			return isEqual(current, next) ? current : next;
		});
	}, [id, allConnections]);

	return {
		connections,
		isActive,
		updateAudioProps,
		updateLabel,
		duplicate,
		remove,
		label: node.label,
		audioProps: node.audioProps,
	} as const;
};

export default useAudioNode;

export type AudioNodeStateValidator = (
	node: AudioNodeState<Record<string, unknown>>,
) => boolean;

export const validateNodeType =
	(
		type: AudioNodeState<Record<string, unknown>>["type"],
	): AudioNodeStateValidator =>
	(node: AudioNodeState<Record<string, unknown>>) =>
		node.type === type;
