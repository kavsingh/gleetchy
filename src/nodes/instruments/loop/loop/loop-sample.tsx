import { useCallback } from "react";

import { selectAudioNodeSubscriptionData } from "~/app-store/audio-nodes/selectors";
import { useAppStore } from "~/app-store/hooks/base";
import Sample from "~/components/sample";
import { isFiniteNumber } from "~/lib/util/predicate";

import type { AppState } from "~/app-store/create";
import type { SampleProps } from "~/components/sample";

export default function LoopSample(_props: SampleProps & { nodeId: string }) {
	const [props, props] = splitProps(_props, ["nodeId"]);
	const store = useAppStore();
	const subscribeToPositionRatio = useCallback(
		(handler: (positionRatio: number) => void) =>
			store.subscribe(() => {
				// @ts-expect-error need to fix useAppStore types
				const state: AppState = store.getState();
				const positionRatio = selectAudioNodeSubscriptionData(
					state,
					props.nodeId,
				)?.["positionRatio"];

				handler(isFiniteNumber(positionRatio) ? positionRatio : 0);
			}),
		[store, props.nodeId],
	);

	return (
		<Sample {...props} subscribeToPositionRatio={subscribeToPositionRatio} />
	);
}
