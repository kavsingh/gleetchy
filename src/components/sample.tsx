import { memo, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import color from "color";
import { noop } from "lodash";

import { layoutAbsoluteFill } from "~/style/layout";
import LoopRegion from "~/components/loop-region";
import Waveform from "~/components/waveform";

import Button from "./button";

import type { FC } from "react";

const Sample: FC<SampleProps> = ({
	audioBuffer,
	subscribeToPositionRatio,
	loopStart = 0,
	loopEnd = 1,
	fromSaved = false,
	onLoopStartDrag = noop,
	onLoopEndDrag = noop,
	onLoopRegionDrag = noop,
	selectAudioFile = noop,
}) => {
	const theme = useTheme();
	const playheadRef = useRef<HTMLDivElement | null>(null);

	const waveForm = useMemo(
		() => (
			<Waveform
				color={theme.colors.text[600]}
				baselineColor={theme.colors.text[100]}
				buffer={audioBuffer}
			/>
		),
		[audioBuffer, theme.colors.text],
	);

	const loopRegion = useMemo(
		() => (
			<LoopRegion
				loopStart={loopStart}
				loopEnd={loopEnd}
				onLoopStartDrag={onLoopStartDrag}
				onLoopEndDrag={onLoopEndDrag}
				onLoopRegionDrag={onLoopRegionDrag}
			/>
		),
		[loopStart, loopEnd, onLoopStartDrag, onLoopEndDrag, onLoopRegionDrag],
	);

	useEffect(
		() =>
			subscribeToPositionRatio?.((ratio) => {
				if (!playheadRef.current) return;

				playheadRef.current.style.transform = `translateX(${ratio * 100}%)`;
			}),
		[subscribeToPositionRatio],
	);

	return (
		<Container>
			<WaveformContainer>{waveForm}</WaveformContainer>
			{audioBuffer ? (
				<>
					<PlayheadContainer>
						<Playhead ref={playheadRef} />
					</PlayheadContainer>
					<LoopRegionContainer>{loopRegion}</LoopRegionContainer>
				</>
			) : (
				<InitLoadButon tabIndex={0} onClick={selectAudioFile}>
					{fromSaved
						? [
								<span key="a">
									Unfortunately audio data is not saved with a project
								</span>,
								<span key="b">
									Click here (or drag and drop) to load files again
								</span>,
						  ]
						: "Click to load audio file or drag it here"}
				</InitLoadButon>
			)}
		</Container>
	);
};

export default memo(Sample);

const Container = styled.div`
	position: relative;
	inline-size: 100%;
	block-size: 100%;
`;

const WaveformContainer = styled.div`
	${layoutAbsoluteFill}
	z-index: 1;
`;

const PlayheadContainer = styled.div`
	${layoutAbsoluteFill}
	overflow: hidden;
	pointer-events: none;
`;

const Playhead = styled.div`
	${layoutAbsoluteFill}
	z-index: 2;
	pointer-events: none;

	&::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		display: block;
		width: 1px;
		background-color: ${({ theme }) => theme.colors.text[600]};
		content: " ";
	}
`;

const LoopRegionContainer = styled.div`
	${layoutAbsoluteFill}
	z-index: 3;
`;

const InitLoadButon = styled(Button)`
	${layoutAbsoluteFill}
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	padding: 3em;
	background-color: ${({ theme }) =>
		color(theme.colors.surface[0]).alpha(0.96).string()};

	span {
		display: block;
		text-align: center;
	}
`;

InitLoadButon.defaultProps = { variant: "text" };

export type SampleProps = {
	audioBuffer: Nullable<AudioBuffer>;
	fromSaved?: boolean | undefined;
	loopStart?: number | undefined;
	loopEnd?: number | undefined;
	onLoopStartDrag?(movement: number): unknown | undefined;
	onLoopEndDrag?(movement: number): unknown | undefined;
	onLoopRegionDrag?(movement: number): unknown | undefined;
	selectAudioFile?(): unknown | undefined;
	subscribeToPositionRatio?(
		handler: (ratio: number) => void,
	): (() => void) | undefined;
};
