import { useCallback } from "react";

import { isFiniteNumber } from "~/lib/util/predicate";
import Sample from "~/components/sample";
import { selectAudioNodeSubscriptionData } from "~/app-store/audio-nodes/selectors";
import { useAppStore } from "~/app-store/hooks/base";

import type { AppState } from "~/app-store/configure-store";
import type { SampleProps } from "~/components/sample";

export default function LoopSample({
	nodeId,
	...props
}: SampleProps & { nodeId: string }) {
	const store = useAppStore();
	const subscribeToPositionRatio = useCallback(
		(handler: (positionRatio: number) => void) =>
			store.subscribe(() => {
				// @ts-expect-error need to fix useAppStore types
				const state: AppState = store.getState();
				const positionRatio = selectAudioNodeSubscriptionData(state, nodeId)?.[
					"positionRatio"
				];

				handler(isFiniteNumber(positionRatio) ? positionRatio : 0);
			}),
		[store, nodeId],
	);

	return (
		<Sample {...props} subscribeToPositionRatio={subscribeToPositionRatio} />
	);
}
