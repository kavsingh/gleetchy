import { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { noop } from "~/lib/util";
import Knob from "~/components/knob";
import TitleBar from "~/components/title-bar";
import SelectBox from "~/components/select-box";

import type { ImpulseName } from "./impulses";
import type { FC } from "react";
import type { AudioNodeConnection } from "~/types";

const Reverb: FC<ReverbProps> = ({
	label = "Reverb",
	wetDryRatio = 0.5,
	isActive = true,
	connections = [],
	impulse = "wide",
	onWetDryRatioChange = noop,
	onLabelChange = noop,
	onImpulseChange = noop,
	remove = noop,
}) => {
	const titleBar = useMemo(
		() => (
			<TitleBar
				type="Reverb"
				label={label}
				connections={connections}
				onLabelChange={onLabelChange}
				onRemoveClick={remove}
			/>
		),
		[connections, label, onLabelChange, remove],
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

	const handleImpulseChange = useCallback(
		(nextImpulse: string) => {
			if (!isValidImpulse(nextImpulse)) return;

			onImpulseChange?.(nextImpulse);
		},
		[onImpulseChange],
	);

	return (
		<Container isActive={isActive}>
			{titleBar}
			<ControlsContainer>
				<SelectBox
					options={impulseOptions}
					onChange={handleImpulseChange}
					value={impulse}
				/>
				<KnobContainer key="wetDry">{wetDryKnob}</KnobContainer>
			</ControlsContainer>
		</Container>
	);
};

export default memo(Reverb);

export interface ReverbProps {
	label: string;
	wetDryRatio: number;
	isActive: boolean;
	connections: AudioNodeConnection[];
	impulse: ImpulseName;
	onWetDryRatioChange(wetDryRatio: number): unknown;
	onLabelChange(label: string): unknown;
	onImpulseChange(impulse: ImpulseName): unknown;
	remove(): unknown;
}

const Container = styled.div<{ isActive: boolean }>`
	inline-size: 100%;
	opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
	transition: opacity 0.2s ease-out;
`;

const ControlsContainer = styled.div`
	display: flex;
	inline-size: 100%;
	gap: 0.4em;
	align-items: flex-start;
`;

const KnobContainer = styled.div`
	flex: 0 0 3em;
`;

const impulseOptions: { value: ImpulseName; label: string }[] = [
	{ value: "wide", label: "Wide" },
	{ value: "tight", label: "Tight" },
];

const isValidImpulse = (value: string): value is ImpulseName => {
	const names = impulseOptions.map((option) => option.value);

	return names.includes(value as ImpulseName);
};
