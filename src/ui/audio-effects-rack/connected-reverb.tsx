import { memo, useCallback } from "react";

import { nodeType, UI } from "~/nodes/audio-effects/reverb";
import useAudioNode, {
	validateNodeType,
} from "~/app-store/hooks/use-audio-node";

import type { FC } from "react";
import type { ImpulseName } from "~/nodes/audio-effects/reverb/impulses";
import type { NodeProps } from "~/nodes/audio-effects/reverb";

const ConnectedReverb: FC<{ id: string }> = ({ id }) => {
	const {
		connections,
		isActive,
		label,
		audioProps,
		updateLabel,
		updateAudioProps,
		remove,
	} = useAudioNode<NodeProps>(id, validateNodeType(nodeType));

	const handleWetDryRatioChange = useCallback(
		(wetDryRatio: number) => updateAudioProps({ wetDryRatio }),
		[updateAudioProps],
	);

	const handleImpulseChange = useCallback(
		(impulse: ImpulseName) => updateAudioProps({ impulse }),
		[updateAudioProps],
	);

	return (
		<UI
			connections={connections}
			isActive={isActive}
			label={label}
			impulse={audioProps.impulse}
			wetDryRatio={audioProps.wetDryRatio}
			onLabelChange={updateLabel}
			onWetDryRatioChange={handleWetDryRatioChange}
			onImpulseChange={handleImpulseChange}
			remove={remove}
		/>
	);
};

export default memo(ConnectedReverb);
