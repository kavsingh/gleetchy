import useFileDropRegion from "~/components/hooks/use-file-drop-region";
import { clamp } from "~/lib/util/number";
import { UI as Eq3 } from "~/nodes/audio-effects/eq3";

import LoopSample from "./loop-sample";
import LoopTitleBar from "./loop-title-bar";
import PlaybackControls from "./playback-controls";

import type { LoopUIProps } from "./types";
import type { ParentProps } from "solid-js";

export default function Loop(props: LoopUIProps) {
	function handleFiles(files: File[]) {
		if (files[0]) props.receiveAudioFile(files[0]);
	}

	function handleLoopStartDrag(movement: number) {
		props.onLoopRegionChange(
			clamp(0, props.loopEnd - 0.0001, props.loopStart + movement),
			props.loopEnd,
		);
	}

	function handleLoopEndDrag(movement: number) {
		props.onLoopRegionChange(
			props.loopStart,
			clamp(props.loopStart + 0.0001, 1, props.loopEnd + movement),
		);
	}

	function handleLoopRegionDrag(movement: number) {
		const span = props.loopEnd - props.loopStart;
		let nextStart: number;
		let nextEnd: number;

		if (movement < 0) {
			const minStart = 0;
			const maxStart = 1 - span;
			const val = props.loopStart + movement;

			nextStart = clamp(minStart, maxStart, val);
			nextEnd = nextStart + span;
		} else {
			const minEnd = span;
			const maxEnd = 1;
			const val = props.loopEnd + movement;

			nextEnd = clamp(minEnd, maxEnd, val);
			nextStart = nextEnd - span;
		}

		props.onLoopRegionChange(nextStart, nextEnd);
	}

	return (
		<div class="w-full">
			<LoopTitleBar
				label={props.label}
				fileName={props.fileName}
				audioBuffer={props.audioBuffer}
				connections={props.connections}
				onLabelChange={(val) => props.onLabelChange(val)}
				duplicate={() => props.duplicate()}
				remove={() => props.remove()}
				selectAudioFile={() => props.selectAudioFile()}
			/>
			<AudioFileDropRegion onFiles={handleFiles}>
				<LoopSample
					nodeId={props.nodeId}
					fromSaved={!!(props.fileName && !props.audioBuffer)}
					audioBuffer={props.audioBuffer}
					loopStart={props.loopStart}
					loopEnd={props.loopEnd}
					onLoopStartDrag={handleLoopStartDrag}
					onLoopEndDrag={handleLoopEndDrag}
					onLoopRegionDrag={handleLoopRegionDrag}
					selectAudioFile={() => props.selectAudioFile()}
				/>
				<div class="flex h-full shrink-0 grow-0 gap-3">
					<PlaybackControls
						gain={props.gain}
						playbackRate={props.playbackRate}
						onGainChange={(val) => props.onGainChange(val)}
						onPlaybackRateChange={(val) => props.onPlaybackRateChange(val)}
					/>
					<Eq3
						lowGain={props.lowGain}
						midGain={props.midGain}
						highGain={props.highGain}
						onChange={(val) => props.onEqChange(val)}
					/>
				</div>
			</AudioFileDropRegion>
		</div>
	);
}

function AudioFileDropRegion(
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	props: ParentProps<{ onFiles(this: void, files: File[]): unknown }>,
) {
	const { eventHandlers } = useFileDropRegion({
		onFiles: props.onFiles,
		fileFilter: ({ type }) => type.startsWith("audio"),
	});

	return (
		<div class="flex h-44 w-full gap-5" {...eventHandlers}>
			{props.children}
		</div>
	);
}
