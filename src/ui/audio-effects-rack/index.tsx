import { useCallback, memo } from "react";
import { ErrorBoundary } from "solid-js";

import useAddNode from "~/app-store/hooks/use-add-node";
import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import ButtonGroup, { Button } from "~/components/button-group";
import { nodeType as delayType } from "~/nodes/audio-effects/delay";
import { nodeType as reverbType } from "~/nodes/audio-effects/reverb";

import ConnectedDelay from "./connected-delay";
import ConnectedReverb from "./connected-reverb";

import type { PropsWithChildren } from "react";

export default memo(function AudioEffectsRack() {
	return (
		<div class="flex w-full flex-wrap items-start">
			<Rack />
			<AddAudioEffectButtons />
		</div>
	);
});

function Rack() {
	const { audioEffects } = useAudioNodesMeta();

	return (
		<>
			{audioEffects.map((props) => {
				switch (props.type) {
					case delayType:
						return (
							<RackMount key={props.id}>
								<ConnectedDelay id={props.id} />
							</RackMount>
						);
					case reverbType:
						return (
							<RackMount key={props.id}>
								<ConnectedReverb id={props.id} />
							</RackMount>
						);
					default:
						return null;
				}
			})}
		</>
	);
}

function AddAudioEffectButtons() {
	const addNode = useAddNode();
	const addReverb = useCallback(() => addNode(reverbType), [addNode]);
	const addDelay = useCallback(() => addNode(delayType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addReverb}>Add Reverb</Button>
			<Button onClick={addDelay}>Add Delay</Button>
		</ButtonGroup>
	);
}

function RackMount(props: PropsWithChildren) {
	return (
		<div class="flex shrink-0 grow basis-40 animate-appear py-4 opacity-0">
			<ErrorBoundary>{props.children}</ErrorBoundary>
		</div>
	);
}
