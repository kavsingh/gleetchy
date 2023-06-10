import { memo, useCallback, useMemo } from "react";
import { noop } from "lodash";

import { DELAY_UPPER_BOUND } from "~/constants/audio";
import Knob from "~/components/knob";
import TitleBar from "~/components/title-bar";

import type { PropsWithChildren } from "react";
import type { AudioNodeConnection } from "~/types";

export default memo(function Delay({
	label = "Delay",
	connections = [],
	wetDryRatio = 0.5,
	delayTime = 1,
	onDelayTimeChange = noop,
	onWetDryRatioChange = noop,
	onLabelChange = noop,
	remove = noop,
}: DelayProps) {
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
		<div className="is-full">
			{titleBar}
			<div className="flex is-full">
				<KnobContainer key="time">{timeKnob}</KnobContainer>
				<KnobContainer key="wetDry">{wetDryKnob}</KnobContainer>
			</div>
		</div>
	);
});

function KnobContainer({ children }: PropsWithChildren) {
	return <div className="shrink-0 grow-0 is-12">{children}</div>;
}

export type DelayProps = {
	label: string;
	connections: AudioNodeConnection[];
	wetDryRatio: number;
	delayTime: number;
	isActive: boolean;
	onDelayTimeChange(delayTime: number): unknown;
	onWetDryRatioChange(wetDryRatio: number): unknown;
	onLabelChange(label: string): unknown;
	remove(): unknown;
};
