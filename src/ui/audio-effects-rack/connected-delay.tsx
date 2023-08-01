import useAudioNode, {
	validateNodeType,
} from "~/app-store/hooks/use-audio-node";
import NodeWrapper from "~/components/node-wrapper";
import { nodeType, UI } from "~/nodes/audio-effects/delay";

import type { NodeProps } from "~/nodes/audio-effects/delay";

export default function ConnectedDelay(props: { id: string }) {
	const {
		connections,
		isActive,
		label,
		audioProps,
		updateLabel,
		updateAudioProps,
		remove,
		// eslint-disable-next-line solid/reactivity
	} = useAudioNode<NodeProps>(props.id, validateNodeType(nodeType));

	function handleDelayTimeChange(delayTime: number) {
		updateAudioProps({ delayTime });
	}

	function handleWetDryRatioChange(wetDryRatio: number) {
		updateAudioProps({ wetDryRatio });
	}

	return (
		<NodeWrapper isActive={isActive()}>
			<UI
				connections={connections()}
				isActive={isActive()}
				label={label()}
				delayTime={audioProps().delayTime}
				wetDryRatio={audioProps().wetDryRatio}
				onLabelChange={updateLabel}
				onDelayTimeChange={handleDelayTimeChange}
				onWetDryRatioChange={handleWetDryRatioChange}
				remove={remove}
			/>
		</NodeWrapper>
	);
}
