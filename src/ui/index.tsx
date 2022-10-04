import { memo, useEffect } from "react";
import styled from "@emotion/styled";

import { requireWindowWith } from "~/lib/env";
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
		const WINDOW = requireWindowWith([
			"addEventListener",
			"removeEventListener",
		]);

		if (!WINDOW) return undefined;

		const clickHandler = () => initAudioContext();

		WINDOW.addEventListener("keydown", registerKeyPress, true);
		WINDOW.addEventListener("keyup", registerKeyRelease, true);
		WINDOW.addEventListener("click", clickHandler, {
			passive: true,
			once: true,
		});

		return () => {
			WINDOW.removeEventListener("keydown", registerKeyPress, true);
			WINDOW.removeEventListener("keyup", registerKeyRelease, true);
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
