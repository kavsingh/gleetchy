import { ErrorBoundary, For, Match, Switch } from "solid-js";

import { useAddNode } from "#app-store/hooks/use-add-node";
import { useAudioNodesMeta } from "#app-store/hooks/use-audio-nodes-meta";
import { ButtonGroup, Button } from "#components/button-group";
import { ErrorMessage } from "#components/error-message";
import { nodeType as loopType } from "#nodes/instruments/loop";

import { ConnectedLoop } from "./connected-loop";

import type { ParentProps } from "solid-js";

export function InstrumentsRack() {
	return (
		<div class="flex w-full flex-col gap-8">
			<Rack />
			<AddInstrumentButtons />
		</div>
	);
}

function Rack() {
	const { instruments } = useAudioNodesMeta();

	return (
		<For each={instruments()}>
			{(instrument) => (
				<Switch fallback={undefined}>
					<Match when={instrument.type === loopType}>
						<RackMount>
							<ConnectedLoop id={instrument.id} />
						</RackMount>
					</Match>
				</Switch>
			)}
		</For>
	);
}

function AddInstrumentButtons() {
	const addNode = useAddNode();

	return (
		<ButtonGroup>
			<Button onClick={[addNode, loopType]}>Add Loop</Button>
		</ButtonGroup>
	);
}

function RackMount(props: ParentProps) {
	return (
		<div class="animate-appear opacity-0">
			<ErrorBoundary fallback={(e) => <ErrorMessage>{String(e)}</ErrorMessage>}>
				{props.children}
			</ErrorBoundary>
		</div>
	);
}
