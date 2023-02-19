import { useCallback, memo } from "react";

import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import useAddNode from "~/app-store/hooks/use-add-node";
import { nodeType as loopType } from "~/nodes/instruments/loop";
import AnimIn from "~/components/anim-in";
import ErrorBoundary from "~/components/error-boundary";
import ButtonGroup, { Button } from "~/components/button-group";

import ConnectedLoop from "./connected-loop";

import type { PropsWithChildren } from "react";

export default memo(function InstrumentsRack() {
	return (
		<div className="flex flex-col gap-8 is-full">
			<Rack />
			<AddInstrumentButtons />
		</div>
	);
});

function Rack() {
	const { instruments } = useAudioNodesMeta();

	return (
		<>
			{instruments.map(({ id, type }) => {
				switch (type) {
					case loopType:
						return (
							<RackMount key={id}>
								<ConnectedLoop id={id} />
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
	const { addNode } = useAddNode();
	const addLoop = useCallback(() => addNode(loopType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addLoop}>Add Loop</Button>
		</ButtonGroup>
	);
}

function RackMount({ children }: PropsWithChildren) {
	return (
		<AnimIn>
			<ErrorBoundary>{children}</ErrorBoundary>
		</AnimIn>
	);
}
