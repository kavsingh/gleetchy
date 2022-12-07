import { useCallback, memo } from "react";
import styled from "@emotion/styled";

import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import useAddNode from "~/app-store/hooks/use-add-node";
import { nodeType as loopType } from "~/nodes/instruments/loop";
import AnimIn from "~/components/anim-in";
import ErrorBoundary from "~/components/error-boundary";
import ButtonGroup, { Button } from "~/components/button-group";

import ConnectedLoop from "./connected-loop";

import type { FC, ReactNode } from "react";

const InstrumentsRack: FC = () => (
	<Container>
		<Rack />
		<AddInstrumentButtons />
	</Container>
);

export default memo(InstrumentsRack);

const Rack: FC = () => {
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
};

const AddInstrumentButtons: FC = () => {
	const { addNode } = useAddNode();
	const addLoop = useCallback(() => addNode(loopType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addLoop}>Add Loop</Button>
		</ButtonGroup>
	);
};

const RackMount: FC<{ children: ReactNode }> = ({ children }) => (
	<AnimIn>
		<ErrorBoundary>{children}</ErrorBoundary>
	</AnimIn>
);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	inline-size: 100%;
	gap: 2em;
`;
