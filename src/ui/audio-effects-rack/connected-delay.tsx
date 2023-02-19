import { memo, useCallback } from "react";

import { nodeType, UI } from "~/nodes/audio-effects/delay";
import useAudioNode, {
	validateNodeType,
} from "~/app-store/hooks/use-audio-node";

import type { NodeProps } from "~/nodes/audio-effects/delay";

export default memo(function ConnectedReverb({ id }: { id: string }) {
	const {
		connections,
		isActive,
		label,
		audioProps,
		updateLabel,
		updateAudioProps,
		remove,
	} = useAudioNode<NodeProps>(id, validateNodeType(nodeType));

	const handleDelayTimeChange = useCallback(
		(delayTime: number) => updateAudioProps({ delayTime }),
		[updateAudioProps],
	);

	const handleWetDryRatioChange = useCallback(
		(wetDryRatio: number) => updateAudioProps({ wetDryRatio }),
		[updateAudioProps],
	);

	return (
		<UI
			connections={connections}
			isActive={isActive}
			label={label}
			delayTime={audioProps.delayTime}
			wetDryRatio={audioProps.wetDryRatio}
			onLabelChange={updateLabel}
			onDelayTimeChange={handleDelayTimeChange}
			onWetDryRatioChange={handleWetDryRatioChange}
			remove={remove}
		/>
	);
});
