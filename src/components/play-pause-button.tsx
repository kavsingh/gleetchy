import { memo } from "react";
import styled from "@emotion/styled";

import type { FC } from "react";

const PlayPauseButton: FC<{
	isPlaying: boolean;
	onClick(): unknown;
}> = ({ isPlaying, onClick }) => (
	<Container role="button" tabIndex={0} onClick={onClick}>
		{isPlaying ? "Stop" : "Play"}
	</Container>
);

export default memo(PlayPauseButton);

const Container = styled.div`
	cursor: pointer;
`;
