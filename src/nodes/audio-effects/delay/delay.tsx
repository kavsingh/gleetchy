import { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { DELAY_UPPER_BOUND } from "~/constants/audio";
import { noop } from "~/lib/util";
import Knob from "~/components/knob";
import TitleBar from "~/components/title-bar";

import type { FC } from "react";
import type { AudioNodeConnection } from "~/types";

const Container = styled.div<{ isActive: boolean }>`
	width: 100%;
	opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
	transition: opacity 0.2s ease-out;
`;

const ControlsContainer = styled.div`
	display: flex;
	width: 100%;
`;

const KnobContainer = styled.div`
	flex: 0 0 3em;
`;

export interface DelayProps {
	label: string;
	connections: AudioNodeConnection[];
	wetDryRatio: number;
	delayTime: number;
	isActive: boolean;
	onDelayTimeChange(delayTime: number): unknown;
	onWetDryRatioChange(wetDryRatio: number): unknown;
	onLabelChange(label: string): unknown;
	remove(): unknown;
}

const Delay: FC<DelayProps> = ({
	label = "Delay",
	connections = [],
	wetDryRatio = 0.5,
	delayTime = 1,
	isActive = true,
	onDelayTimeChange = noop,
	onWetDryRatioChange = noop,
	onLabelChange = noop,
	remove = noop,
}) => {
	const handleTimeKnobChange = useCallback(
		(val: number) => {
			onDelayTimeChange(val * DELAY_UPPER_BOUND);
		},
		[onDelayTimeChange],
	);

	const titleBar = useMemo(
		() => (
			<TitleBar
				type="Delay"
				label={label}
				connections={connections}
				onLabelChange={onLabelChange}
				onRemoveClick={remove}
			/>
		),
		[connections, label, onLabelChange, remove],
	);

	const timeKnob = useMemo(
		() => (
			<Knob
				radius="2.4em"
				value={delayTime / DELAY_UPPER_BOUND}
				onChange={handleTimeKnobChange}
				label="T"
				title="Delay Time"
				valueLabel={delayTime.toFixed(2)}
			/>
		),
		[delayTime, handleTimeKnobChange],
	);

	const wetDryKnob = useMemo(
		() => (
			<Knob
				radius="2.4em"
				value={wetDryRatio}
				onChange={onWetDryRatioChange}
				label="W / D"
				title="Wet / Dry Ratio"
				valueLabel={`${(wetDryRatio * 100).toFixed(1)}%`}
			/>
		),
		[onWetDryRatioChange, wetDryRatio],
	);

	return (
		<Container isActive={isActive}>
			{titleBar}
			<ControlsContainer>
				<KnobContainer key="time">{timeKnob}</KnobContainer>
				<KnobContainer key="wetDry">{wetDryKnob}</KnobContainer>
			</ControlsContainer>
		</Container>
	);
};

export default memo(Delay);
