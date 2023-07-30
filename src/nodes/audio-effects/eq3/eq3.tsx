import { noop } from "lodash";
import { memo, useCallback, useMemo } from "react";

import Slider from "~/components/slider";

import type { PropsWithChildren } from "react";

export default memo(function Eq3({
	lowGain = 0,
	midGain = 0,
	highGain = 0,
	onChange = noop,
}: Eq3Props) {
	const handleLowGainChange = useCallback(
		(val: number) => onChange({ lowGain: val * 2 - 1 }),
		[onChange],
	);

	const handleMidGainChange = useCallback(
		(val: number) => onChange({ midGain: val * 2 - 1 }),
		[onChange],
	);

	const handleHighGainChange = useCallback(
		(val: number) => onChange({ highGain: val * 2 - 1 }),
		[onChange],
	);

	const lowGainSlider = useMemo(
		() => (
			<Slider
				value={lowGain * 0.5 + 0.5}
				title="EQ Low Gain"
				label="L"
				valueLabel={lowGain.toFixed(1)}
				onChange={handleLowGainChange}
			/>
		),
		[handleLowGainChange, lowGain],
	);

	const midGainSlider = useMemo(
		() => (
			<Slider
				value={midGain * 0.5 + 0.5}
				title="EQ Mid Gain"
				label="M"
				valueLabel={midGain.toFixed(1)}
				onChange={handleMidGainChange}
			/>
		),
		[handleMidGainChange, midGain],
	);

	const highGainSlider = useMemo(
		() => (
			<Slider
				value={highGain * 0.5 + 0.5}
				title="EQ High Gain"
				label="H"
				valueLabel={highGain.toFixed(1)}
				onChange={handleHighGainChange}
			/>
		),
		[handleHighGainChange, highGain],
	);

	return (
		<div className="flex h-full gap-2">
			<SliderContainer key="lowGain">{lowGainSlider}</SliderContainer>
			<SliderContainer key="midGain">{midGainSlider}</SliderContainer>
			<SliderContainer key="highGain">{highGainSlider}</SliderContainer>
		</div>
	);
});

function SliderContainer({ children }: PropsWithChildren) {
	return <div className="h-full w-4">{children}</div>;
}

export type Eq3Props = {
	lowGain: number;
	midGain: number;
	highGain: number;
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	onChange(eqProps: { [key: string]: number }): unknown;
};
