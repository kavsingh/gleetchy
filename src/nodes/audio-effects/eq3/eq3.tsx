// eslint-disable-next-line filenames/match-exported
import Slider from "~/components/slider";

import type { ParentProps } from "solid-js";

export default function Eq3(props: Eq3Props) {
	function handleLowGainChange(val: number) {
		props.onChange({ lowGain: val * 2 - 1 });
	}

	function handleMidGainChange(val: number) {
		props.onChange({ midGain: val * 2 - 1 });
	}

	function handleHighGainChange(val: number) {
		props.onChange({ highGain: val * 2 - 1 });
	}

	return (
		<div class="flex h-full gap-2">
			<SliderContainer>
				<Slider
					value={props.lowGain * 0.5 + 0.5}
					title="EQ Low Gain"
					label="L"
					valueLabel={props.lowGain.toFixed(1)}
					onChange={handleLowGainChange}
				/>
			</SliderContainer>
			<SliderContainer>
				<Slider
					value={props.midGain * 0.5 + 0.5}
					title="EQ Mid Gain"
					label="M"
					valueLabel={props.midGain.toFixed(1)}
					onChange={handleMidGainChange}
				/>
			</SliderContainer>
			<SliderContainer>
				<Slider
					value={props.highGain * 0.5 + 0.5}
					title="EQ High Gain"
					label="H"
					valueLabel={props.highGain.toFixed(1)}
					onChange={handleHighGainChange}
				/>
			</SliderContainer>
		</div>
	);
}

function SliderContainer(props: ParentProps) {
	return <div class="h-full w-4">{props.children}</div>;
}

export type Eq3Props = {
	lowGain: number;
	midGain: number;
	highGain: number;
	onChange(eqProps: Record<string, number>): unknown;
};
