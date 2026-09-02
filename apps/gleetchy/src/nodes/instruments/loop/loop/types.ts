import type { Eq3GainProps } from "~/nodes/audio-effects/eq3/eq-3";
import type { AudioNodeConnection } from "~/types";

export interface LoopUIProps {
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
	audioBuffer: AudioBuffer | undefined;
	onGainChange: (gain: number) => unknown;
	onPlaybackRateChange: (playbackRate: number) => unknown;
	onEqChange: (props: Partial<Eq3GainProps>) => unknown;
	loadAudioFile: (file: File) => unknown;
	onLoopRegionChange: (start: number, end: number) => unknown;
	onLabelChange: (label: string) => unknown;
	duplicate: () => unknown;
	remove: () => unknown;
}
