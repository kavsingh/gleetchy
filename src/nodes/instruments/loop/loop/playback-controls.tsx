import { memo, useMemo, useCallback } from "react";
import { noop } from "lodash";

import Knob from "~/components/knob";

export default memo(function PlaybackControls({
	gain = 1,
	playbackRate = 1,
	onGainChange = noop,
	onPlaybackRateChange = noop,
}: Props) {
	const handlePlaybackRateChange = useCallback(
		(val: number) => onPlaybackRateChange(val * 2),
		[onPlaybackRateChange],
	);

	const gainKnob = useMemo(
		() => (
			<Knob
				value={gain}
				title="Gain"
				label="G"
				valueLabel={gain.toFixed(2)}
				onChange={onGainChange}
			/>
		),
		[gain, onGainChange],
	);

	const speedKnob = useMemo(
		() => (
			<Knob
				value={playbackRate * 0.5}
				title="Speed"
				label="S"
				valueLabel={playbackRate.toFixed(2)}
				onChange={handlePlaybackRateChange}
			/>
		),
		[handlePlaybackRateChange, playbackRate],
	);

	return (
		<div className="flex flex-col items-center justify-between bs-full">
			<div key="gain">{gainKnob}</div>
			<div key="speed">{speedKnob}</div>
		</div>
	);
});

type Props = {
	gain: number;
	playbackRate: number;
	onGainChange(gain: number): unknown;
	onPlaybackRateChange(playbackRate: number): unknown;
};
