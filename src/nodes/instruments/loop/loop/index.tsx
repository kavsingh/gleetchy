import { memo, useCallback, useEffect, useRef } from "react";

import useFileDropRegion from "~/components/hooks/use-file-drop-region";
import { clamp } from "~/lib/util/number";
import { UI as Eq3 } from "~/nodes/audio-effects/eq3";

import LoopSample from "./loop-sample";
import LoopTitleBar from "./loop-title-bar";
import PlaybackControls from "./playback-controls";

import type { LoopUIProps } from "./types";
import type { PropsWithChildren } from "react";

export default memo(function Loop({
	loopStart,
	loopEnd,
	label,
	fileName,
	connections,
	highGain,
	midGain,
	lowGain,
	playbackRate,
	gain,
	nodeId,
	audioBuffer,
	onGainChange,
	onPlaybackRateChange,
	onEqChange,
	selectAudioFile,
	onLabelChange,
	duplicate,
	remove,
	receiveAudioFile,
	onLoopRegionChange,
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
			const span = regionRef.current.loopEnd - regionRef.current.loopStart;
			let nextStart: number;
			let nextEnd: number;

			if (movement < 0) {
				const minStart = 0;
				const maxStart = 1 - span;
				const val = regionRef.current.loopStart + movement;

				nextStart = clamp(val, minStart, maxStart);
				nextEnd = nextStart + span;
			} else {
				const minEnd = span;
				const maxEnd = 1;
				const val = regionRef.current.loopEnd + movement;

				nextEnd = clamp(val, minEnd, maxEnd);
				nextStart = nextEnd - span;
			}

			onLoopRegionChange(nextStart, nextEnd);
		},
		[onLoopRegionChange],
	);

	return (
		<div className="w-full">
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
				<div className="flex h-full shrink-0 grow-0 gap-3">
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
		<div className="flex h-44 w-full gap-5" {...eventHandlers}>
			{children}
		</div>
	);
}
