import { memo, useCallback, useEffect, useRef } from "react";
import { clamp, noop } from "lodash";

import { UI as Eq3 } from "~/nodes/audio-effects/eq3";
import useFileDropRegion from "~/components/hooks/use-file-drop-region";

import LoopSample from "./loop-sample";
import PlaybackControls from "./playback-controls";
import LoopTitleBar from "./loop-title-bar";

import type { PropsWithChildren } from "react";
import type { LoopUIProps } from "./types";

export default memo(function Loop({
	nodeId,
	audioBuffer,
	loopStart = 0,
	loopEnd = 1,
	label = "",
	fileName = "",
	connections = [],
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
}: LoopUIProps) {
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
		<div className="is-full">
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
			<AudioFileDropRegion onFiles={handleFiles}>
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
				<div className="flex shrink-0 grow-0 gap-3 bs-full">
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
				</div>
			</AudioFileDropRegion>
		</div>
	);
});

function AudioFileDropRegion({
	children,
	onFiles,
}: PropsWithChildren<{ onFiles(files: File[]): unknown }>) {
	const { eventHandlers } = useFileDropRegion({
		onFiles,
		fileFilter: ({ type }) => type.startsWith("audio"),
	});

	return (
		<div className="flex gap-5 bs-44 is-full" {...eventHandlers}>
			{children}
		</div>
	);
}
