import type { AudioNodeConnection } from "~/types";

export type LoopUIProps = {
	nodeId: string;
	loopStart: number;
	loopEnd: number;
	label: string;
	fileName: string;
	connections: AudioNodeConnection[];
	isActive: boolean;
	highGain: number;
	midGain: number;
	lowGain: number;
	playbackRate: number;
	gain: number;
	audioBuffer: Nullable<AudioBuffer>;
	onGainChange(gain: number): unknown;
	onPlaybackRateChange(playbackRate: number): unknown;
	onEqChange(props: Record<string, number>): unknown;
	loadAudioFile(file: File): unknown;
	onLoopRegionChange(start: number, end: number): unknown;
	onLabelChange(label: string): unknown;
	duplicate(): unknown;
	remove(): unknown;
};
