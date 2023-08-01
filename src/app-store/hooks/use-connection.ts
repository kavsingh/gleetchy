import { deepEqual } from "fast-equals";
import { createMemo } from "solid-js";

import { getConnectionBetween, canConnectNodes } from "~/lib/audio";

import { useAppDispatch, useAppSelector } from "./base";
import { toggleConnection as toggleConnectionAction } from "../connections/actions";
import { selectConnections } from "../connections/selectors";

import type { AudioNodeMeta } from "~/types";

export default function useConnection(
	source: AudioNodeMeta,
	target: AudioNodeMeta,
) {
	const dispatch = useAppDispatch();
	const connections = useAppSelector(selectConnections);
	const connection = createMemo(
		() => getConnectionBetween(connections(), source, target),
		{ equals: deepEqual },
	);
	const isBlocked = createMemo(
		() => !canConnectNodes(connections(), source, target),
		{ equals: deepEqual },
	);

	function toggleConnection() {
		if (!isBlocked()) {
			dispatch(toggleConnectionAction({ fromId: source.id, toId: target.id }));
		}
	}

	return { connection, isBlocked, toggleConnection } as const;
}
