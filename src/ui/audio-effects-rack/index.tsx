import { useCallback, memo } from "react";
import styled from "@emotion/styled";

import AnimIn from "~/components/anim-in";
import { nodeType as delayType } from "~/nodes/audio-effects/delay";
import { nodeType as reverbType } from "~/nodes/audio-effects/reverb";
import useAudioNodesMeta from "~/app-store/hooks/use-audio-nodes-meta";
import useAddNode from "~/app-store/hooks/use-add-node";
import ButtonGroup, { Button } from "~/components/button-group";
import ErrorBoundary from "~/components/error-boundary";

import ConnectedDelay from "./connected-delay";
import ConnectedReverb from "./connected-reverb";

import type { FC, ReactNode } from "react";

const AudioEffectsRack: FC = () => (
	<Container>
		<Rack />
		<AddAudioEffectButtons />
	</Container>
);

export default memo(AudioEffectsRack);

const Rack: FC = () => {
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
};

const AddAudioEffectButtons: FC = () => {
	const { addNode } = useAddNode();
	const addReverb = useCallback(() => addNode(reverbType), [addNode]);
	const addDelay = useCallback(() => addNode(delayType), [addNode]);

	return (
		<ButtonGroup>
			<Button onClick={addReverb}>Add Reverb</Button>
			<Button onClick={addDelay}>Add Delay</Button>
		</ButtonGroup>
	);
};

const RackMount: FC<{ children: ReactNode }> = ({ children }) => (
	<AudioEffectContainer>
		<ErrorBoundary>{children}</ErrorBoundary>
	</AudioEffectContainer>
);

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	inline-size: 100%;
`;

const AudioEffectContainer = styled(AnimIn)`
	flex: 1 0 10em;
	padding: 1em 0;
`;
