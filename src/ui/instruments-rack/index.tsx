import { useCallback, memo } from "react";
import { ErrorBoundary } from "solid-js";

import useAddNode from "~/app-store/hooks/use-add-node";
import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import ButtonGroup, { Button } from "~/components/button-group";
import { nodeType as loopType } from "~/nodes/instruments/loop";

import ConnectedLoop from "./connected-loop";

import type { PropsWithChildren } from "react";

export default memo(function InstrumentsRack() {
	return (
		<div class="flex w-full flex-col gap-8">
			<Rack />
			<AddInstrumentButtons />
		</div>
	);
});

function Rack() {
	const { instruments } = useAudioNodesMeta();

	return (
		<>
			{instruments.map((props) => {
				switch (props.type) {
					case loopType:
						return (
							<RackMount key={props.id}>
								<ConnectedLoop id={props.id} />
							</RackMount>
						);
					default:
						return null;
				}
			})}
		</>
	);
}

function AddInstrumentButtons() {
	const addNode = useAddNode();
	const addLoop = useCallback(() => addNode(loopType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addLoop}>Add Loop</Button>
		</ButtonGroup>
	);
}

function RackMount(props: PropsWithChildren) {
	return (
		<div class="animate-appear opacity-0">
			<ErrorBoundary>{props.children}</ErrorBoundary>
		</div>
	);
}
