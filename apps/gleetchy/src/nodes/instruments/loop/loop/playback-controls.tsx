import { Knob } from "#components/knob";
import { denormalize, normalize } from "#lib/util/number";

export function PlaybackControls(props: Props) {
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
					value={normalizeRate(props.playbackRate)}
					title="Speed"
					label="S"
					valueLabel={props.playbackRate.toFixed(2)}
					onChange={(val) => props.onPlaybackRateChange(denormalizeRate(val))}
				/>
			</div>
		</div>
	);
}

const normalizeRate = normalize.bind(undefined, 0, 2);
const denormalizeRate = denormalize.bind(undefined, 0, 2);

interface Props {
	gain: number;
	playbackRate: number;
	onGainChange(gain: number): unknown;
	onPlaybackRateChange(playbackRate: number): unknown;
}
