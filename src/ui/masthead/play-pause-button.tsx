import { memo } from "react";
import styled from "@emotion/styled";

import useGlobalPlayback from "~/app-store/hooks/use-global-playback";
import Button from "~/components/button";

import type { FC } from "react";

const PlayPauseButton: FC = () => {
	const { isPlaying, togglePlayback } = useGlobalPlayback();

	return (
		<Container tabIndex={0} onClick={togglePlayback} size="inherit">
			{isPlaying ? "Stop" : "Play"}
		</Container>
	);
};

export default memo(PlayPauseButton);

const Container = styled(Button)`
	cursor: pointer;
`;
