import { ErrorBoundary, For, Match, Switch } from "solid-js";

import { useAddNode } from "#app-store/hooks/use-add-node";
import { useAudioNodesMeta } from "#app-store/hooks/use-audio-nodes-meta";
import { ButtonGroup, Button } from "#components/button-group";
import { ErrorMessage } from "#components/error-message";
import { nodeType as delayType } from "#nodes/audio-effects/delay";
import { nodeType as reverbType } from "#nodes/audio-effects/reverb";

import { ConnectedDelay } from "./connected-delay";
import { ConnectedReverb } from "./connected-reverb";

import type { ParentProps } from "solid-js";

export function AudioEffectsRack() {
	return (
		<div class="flex w-full flex-wrap items-start">
			<Rack />
			<AddAudioEffectButtons />
		</div>
	);
}

function Rack() {
	const { audioEffects } = useAudioNodesMeta();

	return (
		<For each={audioEffects()}>
			{(effect) => (
				<Switch fallback={undefined}>
					<Match when={effect.type === reverbType}>
						<RackMount>
							<ConnectedReverb id={effect.id} />
						</RackMount>
					</Match>
					<Match when={effect.type === delayType}>
						<RackMount>
							<ConnectedDelay id={effect.id} />
						</RackMount>
					</Match>
				</Switch>
			)}
		</For>
	);
}

function AddAudioEffectButtons() {
	const addNode = useAddNode();

	return (
		<ButtonGroup>
			<Button onClick={[addNode, reverbType]}>Add Reverb</Button>
			<Button onClick={[addNode, delayType]}>Add Delay</Button>
		</ButtonGroup>
	);
}

function RackMount(props: ParentProps) {
	return (
		<div class="flex shrink-0 grow basis-40 animate-appear py-4 opacity-0">
			<ErrorBoundary fallback={(e) => <ErrorMessage>{String(e)}</ErrorMessage>}>
				{props.children}
			</ErrorBoundary>
		</div>
	);
}
