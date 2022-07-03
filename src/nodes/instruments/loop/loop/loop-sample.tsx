import { isFiniteNumber } from "~/lib/util/predicate";
import useAudioNodeSubscriptionData from "~/app-store/hooks/use-audio-node-subscription-data";
import Sample from "~/components/sample";

import type { FC } from "react";
import type { SampleProps } from "~/components/sample";

const LoopSample: FC<SampleProps & { nodeId: string }> = ({
	nodeId,
	...props
}) => {
	const positionRatio = useAudioNodeSubscriptionData(nodeId)?.positionRatio;

	return (
		<Sample
			{...props}
			positionRatio={isFiniteNumber(positionRatio) ? positionRatio : undefined}
		/>
	);
};

export default LoopSample;
