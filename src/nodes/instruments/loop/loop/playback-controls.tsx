import Knob from "~/components/knob";

export default function PlaybackControls(props: Props) {
	function handlePlaybackRateChange(val: number) {
		props.onPlaybackRateChange(val * 2);
	}

	return (
		<div class="flex h-full flex-col items-center justify-between">
			<div>
				<Knob
					value={props.gain}
					title="Gain"
					label="G"
					valueLabel={props.gain.toFixed(2)}
					onChange={(val) => props.onGainChange(val)}
				/>
			</div>
			<div>
				<Knob
					value={props.playbackRate * 0.5}
					title="Speed"
					label="S"
					valueLabel={props.playbackRate.toFixed(2)}
					onChange={handlePlaybackRateChange}
				/>
			</div>
		</div>
	);
}

type Props = {
	gain: number;
	playbackRate: number;
	onGainChange(gain: number): unknown;
	onPlaybackRateChange(playbackRate: number): unknown;
};
