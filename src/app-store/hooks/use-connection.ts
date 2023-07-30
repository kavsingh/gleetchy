import { useCallback } from "react";

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
	const connection = getConnectionBetween(connections, source, target);
	const isBlocked = !canConnectNodes(connections, source, target);

	const toggleConnection = useCallback(() => {
		if (!isBlocked) {
			dispatch(toggleConnectionAction({ fromId: source.id, toId: target.id }));
		}
	}, [isBlocked, dispatch, source.id, target.id]);

	return { connection, isBlocked, toggleConnection } as const;
}
