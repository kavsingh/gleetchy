import { memo, useEffect } from "react";
import styled from "@emotion/styled";

import useModifierKeys from "~/app-store/hooks/use-modifier-keys";
import useAudioContext from "~/app-store/hooks/use-audio-context";

import AudioEffectsRack from "./audio-effects-rack";
import InstrumentsRack from "./instruments-rack";
import PatchBay from "./patch-bay";
import Masthead from "./masthead";

import type { FC } from "react";

const UI: FC = () => {
	const { initAudioContext } = useAudioContext();
	const { registerKeyPress, registerKeyRelease } = useModifierKeys();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!globalThis.window) return undefined;

		const clickHandler = () => initAudioContext();

		globalThis.window.addEventListener("keydown", registerKeyPress, true);
		globalThis.window.addEventListener("keyup", registerKeyRelease, true);
		globalThis.window.addEventListener("click", clickHandler, {
			passive: true,
			once: true,
		});

		return () => {
			globalThis.window.removeEventListener("keydown", registerKeyPress, true);
			globalThis.window.removeEventListener("keyup", registerKeyRelease, true);
		};
	}, [registerKeyPress, registerKeyRelease, initAudioContext]);

	return (
		<Container>
			<Masthead />
			<Divider />
			<InstrumentsRack />
			<Divider />
			<ModifiersContainer>
				<AudioEffectsRackContainer>
					<AudioEffectsRack />
				</AudioEffectsRackContainer>
				<PatchBayContainer>
					<PatchBay />
				</PatchBayContainer>
			</ModifiersContainer>
		</Container>
	);
};

export default memo(UI);

const Container = styled.div`
	max-inline-size: 92em;
	margin: 0 auto;
	padding: 2em;
`;

const Divider = styled.div`
	block-size: 1px;
	margin: 1em 0;
	background-color: ${({ theme }) => theme.colors.text[100]};
`;

const ModifiersContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const AudioEffectsRackContainer = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
`;

const PatchBayContainer = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
`;
