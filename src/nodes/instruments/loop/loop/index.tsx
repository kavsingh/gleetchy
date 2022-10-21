import { memo, useCallback, useEffect, useRef } from "react";
import { clamp, noop } from "lodash";
import styled from "@emotion/styled";

import { UI as Eq3 } from "~/nodes/audio-effects/eq3";
import useFileDropRegion from "~/components/hooks/use-file-drop-region";

import LoopSample from "./loop-sample";
import PlaybackControls from "./playback-controls";
import LoopTitleBar from "./loop-title-bar";

import type { FC, ReactNode } from "react";
import type { LoopUIProps } from "./types";

const Loop: FC<LoopUIProps> = ({
	nodeId,
	audioBuffer,
	loopStart = 0,
	loopEnd = 1,
	label = "",
	fileName = "",
	connections = [],
	isActive = true,
	highGain = 0,
	midGain = 0,
	lowGain = 0,
	playbackRate = 1,
	gain = 0.5,
	onGainChange = noop,
	onPlaybackRateChange = noop,
	onEqChange = noop,
	selectAudioFile = noop,
	onLabelChange = noop,
	duplicate = noop,
	remove = noop,
	receiveAudioFile = noop,
	onLoopRegionChange = noop,
}) => {
	const regionRef = useRef({ loopStart, loopEnd });

	useEffect(() => {
		regionRef.current = { loopStart, loopEnd };
	}, [loopStart, loopEnd]);

	const handleFiles = useCallback(
		(files: File[]) => {
			if (files[0]) receiveAudioFile(files[0]);
		},
		[receiveAudioFile],
	);

	const handleLoopStartDrag = useCallback(
		(movement: number) => {
			onLoopRegionChange(
				clamp(
					regionRef.current.loopStart + movement,
					0,
					regionRef.current.loopEnd - 0.0001,
				),
				regionRef.current.loopEnd,
			);
		},
		[onLoopRegionChange],
	);

	const handleLoopEndDrag = useCallback(
		(movement: number) => {
			onLoopRegionChange(
				regionRef.current.loopStart,
				clamp(
					regionRef.current.loopEnd + movement,
					regionRef.current.loopStart + 0.0001,
					1,
				),
			);
		},
		[onLoopRegionChange],
	);

	const handleLoopRegionDrag = useCallback(
		(movement: number) => {
			const gap = regionRef.current.loopEnd - regionRef.current.loopStart;
			let nextStart: number;
			let nextEnd: number;

			if (movement < 0) {
				nextStart = clamp(regionRef.current.loopStart + movement, 0, 1 - gap);
				nextEnd = nextStart + gap;
			} else {
				nextEnd = clamp(regionRef.current.loopEnd + movement, gap, 1);
				nextStart = nextEnd - gap;
			}

			onLoopRegionChange(nextStart, nextEnd);
		},
		[onLoopRegionChange],
	);

	return (
		<Container isActive={isActive}>
			<AudioFileDropRegion onFiles={handleFiles}>
				<TitleBarContainer>
					<LoopTitleBar
						label={label}
						fileName={fileName}
						audioBuffer={audioBuffer}
						connections={connections}
						onLabelChange={onLabelChange}
						duplicate={duplicate}
						remove={remove}
						selectAudioFile={selectAudioFile}
					/>
				</TitleBarContainer>
				<MainContainer>
					<LoopSample
						nodeId={nodeId}
						fromSaved={!!(fileName && !audioBuffer)}
						audioBuffer={audioBuffer}
						loopStart={loopStart}
						loopEnd={loopEnd}
						onLoopStartDrag={handleLoopStartDrag}
						onLoopEndDrag={handleLoopEndDrag}
						onLoopRegionDrag={handleLoopRegionDrag}
						selectAudioFile={selectAudioFile}
					/>
					<ControlsContainer>
						<PlaybackControls
							gain={gain}
							playbackRate={playbackRate}
							onGainChange={onGainChange}
							onPlaybackRateChange={onPlaybackRateChange}
						/>
						<Eq3
							lowGain={lowGain}
							midGain={midGain}
							highGain={highGain}
							onChange={onEqChange}
						/>
					</ControlsContainer>
				</MainContainer>
			</AudioFileDropRegion>
		</Container>
	);
};

export default memo(Loop);

const Container = styled.div<{ isActive: boolean }>`
	inline-size: 100%;
	block-size: 12em;
	opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
	transition: opacity 0.2s ease-out;
`;

const TitleBarContainer = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
	inline-size: 100%;
`;

const MainContainer = styled.div`
	display: flex;
	flex: 1 0 10em;
	flex-wrap: nowrap;
	inline-size: 100%;
	padding-inline-start: 0.2em;
`;

const ControlsContainer = styled.div`
	display: flex;
	block-size: 100%;
	margin-inline-start: 1.2em;
`;

const AudioFileDropRegion: FC<{
	children: ReactNode;
	onFiles(files: File[]): unknown;
}> = ({ children, onFiles }) => {
	const { eventHandlers } = useFileDropRegion({
		onFiles,
		fileFilter: ({ type }) => type.startsWith("audio"),
	});

	return <FileDropWrapper {...eventHandlers}>{children}</FileDropWrapper>;
};

const FileDropWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	inline-size: 100%;
	block-size: 100%;
`;
