import Slider from "#components/slider";
import { normalize, denormalize } from "#lib/util/number";

import type { ParentProps } from "solid-js";

export default function Eq3(props: Eq3Props) {
	function handleLowGainChange(val: number) {
		props.onChange({ lowGain: denormalizeGain(val) });
	}

	function handleMidGainChange(val: number) {
		props.onChange({ midGain: denormalizeGain(val) });
	}

	function handleHighGainChange(val: number) {
		props.onChange({ highGain: denormalizeGain(val) });
	}

	return (
		<div class="flex h-full gap-2">
			<SliderContainer>
				<Slider
					value={normalizeGain(props.lowGain)}
					title="EQ Low Gain"
					label="L"
					valueLabel={props.lowGain.toFixed(1)}
					onChange={handleLowGainChange}
				/>
			</SliderContainer>
			<SliderContainer>
				<Slider
					value={normalizeGain(props.midGain)}
					title="EQ Mid Gain"
					label="M"
					valueLabel={props.midGain.toFixed(1)}
					onChange={handleMidGainChange}
				/>
			</SliderContainer>
			<SliderContainer>
				<Slider
					value={normalizeGain(props.highGain)}
					title="EQ High Gain"
					label="H"
					valueLabel={props.highGain.toFixed(1)}
					onChange={handleHighGainChange}
				/>
			</SliderContainer>
		</div>
	);
}

const normalizeGain = normalize.bind(null, -1, 1);
const denormalizeGain = denormalize.bind(null, -1, 1);

function SliderContainer(props: ParentProps) {
	return <div class="h-full w-4">{props.children}</div>;
}

export interface Eq3Props {
	lowGain: number;
	midGain: number;
	highGain: number;
	onChange(eqProps: Record<string, number>): unknown;
}
