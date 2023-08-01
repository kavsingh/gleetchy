import { splitProps } from "solid-js";

import { selectAudioNodeSubscriptionData } from "~/app-store/audio-nodes/selectors";
import { useAppStore } from "~/app-store/hooks/base";
import Sample from "~/components/sample";
import { isFiniteNumber } from "~/lib/util/predicate";

import type { AppState } from "~/app-store/create";
import type { SampleProps } from "~/components/sample";

export default function LoopSample(props: SampleProps & { nodeId: string }) {
	const [local, sampleProps] = splitProps(props, ["nodeId"]);
	const store = useAppStore();

	function subscribeToPositionRatio(handler: (positionRatio: number) => void) {
		// eslint-disable-next-line solid/reactivity
		return store.subscribe(() => {
			const state: AppState = store.getState();
			const positionRatio = selectAudioNodeSubscriptionData(
				state,
				local.nodeId,
			)?.["positionRatio"];

			handler(isFiniteNumber(positionRatio) ? positionRatio : 0);
		});
	}

	return (
		<Sample
			{...sampleProps}
			subscribeToPositionRatio={subscribeToPositionRatio}
		/>
	);
}
