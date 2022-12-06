import { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { noop } from "lodash";

import Slider from "~/components/slider";

import type { FC } from "react";

const Container = styled.div`
	display: flex;
	block-size: 100%;
	margin-inline-start: 0.6em;
`;

const SliderContainer = styled.div`
	inline-size: 2em;
	block-size: 100%;
`;

export interface Eq3Props {
	lowGain: number;
	midGain: number;
	highGain: number;
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
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
