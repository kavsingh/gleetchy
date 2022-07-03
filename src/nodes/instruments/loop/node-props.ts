import { defaultProps as eq3DefaultProps } from "~/nodes/audio-effects/eq3/node-props";

export const defaultProps = {
	...eq3DefaultProps,
	audioBuffer: undefined,
	playbackPosition: undefined,
	fileName: "",
	fileType: "",
	gain: 0.5,
	loopEnd: 1,
	loopStart: 0,
	playbackRate: 1,
};

export type Props = Omit<
	typeof defaultProps,
	"audioBuffer" | "playbackPosition"
> & {
	audioBuffer: AudioBuffer | undefined;
	playbackPosition: number | undefined;
};
