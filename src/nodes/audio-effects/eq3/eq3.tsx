import { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { noop } from "~/lib/util";
import Slider from "~/components/slider";

import type { FC } from "react";

const Container = styled.div`
	display: flex;
	height: 100%;
	margin-left: 0.6em;
`;

const SliderContainer = styled.div`
	width: 2em;
	height: 100%;
`;

export interface Eq3Props {
	lowGain: number;
	midGain: number;
	highGain: number;
	onChange(eqProps: { [key: string]: number }): unknown;
}

const Eq3: FC<Eq3Props> = ({
	lowGain = 0,
	midGain = 0,
	highGain = 0,
	onChange = noop,
}) => {
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
		<Container>
			<SliderContainer key="lowGain">{lowGainSlider}</SliderContainer>
			<SliderContainer key="midGain">{midGainSlider}</SliderContainer>
			<SliderContainer key="highGain">{highGainSlider}</SliderContainer>
		</Container>
	);
};

export default memo(Eq3);
