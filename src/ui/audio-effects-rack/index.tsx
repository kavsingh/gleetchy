import { useCallback, memo } from "react";

import { nodeType as delayType } from "~/nodes/audio-effects/delay";
import { nodeType as reverbType } from "~/nodes/audio-effects/reverb";
import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import useAddNode from "~/app-store/hooks/use-add-node";
import ButtonGroup, { Button } from "~/components/button-group";
import ErrorBoundary from "~/components/error-boundary";

import ConnectedDelay from "./connected-delay";
import ConnectedReverb from "./connected-reverb";

import type { PropsWithChildren } from "react";

export default memo(function AudioEffectsRack() {
	return (
		<div className="flex flex-wrap items-start is-full">
			<Rack />
			<AddAudioEffectButtons />
		</div>
	);
});

function Rack() {
	const { audioEffects } = useAudioNodesMeta();

	return (
		<>
			{audioEffects.map(({ id, type }) => {
				switch (type) {
					case delayType:
						return (
							<RackMount key={id}>
								<ConnectedDelay id={id} />
							</RackMount>
						);
					case reverbType:
						return (
							<RackMount key={id}>
								<ConnectedReverb id={id} />
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
	const { addNode } = useAddNode();
	const addReverb = useCallback(() => addNode(reverbType), [addNode]);
	const addDelay = useCallback(() => addNode(delayType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addReverb}>Add Reverb</Button>
			<Button onClick={addDelay}>Add Delay</Button>
		</ButtonGroup>
	);
}

function RackMount({ children }: PropsWithChildren) {
	return (
		<div className="flex shrink-0 grow basis-40 animate-appear opacity-0 plb-4">
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	);
}
