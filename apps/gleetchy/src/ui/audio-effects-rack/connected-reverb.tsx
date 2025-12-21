import { Show } from "solid-js";

import {
	useAudioNode,
	validateNodeType,
} from "#app-store/hooks/use-audio-node";
import { NodeWrapper } from "#components/node-wrapper";
import { nodeType, UI } from "#nodes/audio-effects/reverb";

import type { NodeProps } from "#nodes/audio-effects/reverb";
import type { ImpulseName } from "#nodes/audio-effects/reverb/impulses";

export function ConnectedReverb(props: { id: string }) {
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

	function handleWetDryRatioChange(wetDryRatio: number) {
		updateAudioProps({ wetDryRatio });
	}

	function handleImpulseChange(impulse: ImpulseName) {
		updateAudioProps({ impulse });
	}

	return (
		<Show when={audioProps()}>
			{(audio) => (
				<NodeWrapper isActive={isActive()}>
					<UI
						connections={connections()}
						isActive={isActive()}
						label={label() ?? ""}
						impulse={audio().impulse}
						wetDryRatio={audio().wetDryRatio}
						onLabelChange={updateLabel}
						onWetDryRatioChange={handleWetDryRatioChange}
						onImpulseChange={handleImpulseChange}
						remove={remove}
					/>
				</NodeWrapper>
			)}
		</Show>
	);
}
