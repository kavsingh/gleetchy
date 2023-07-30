import { memo, useCallback, useMemo } from "react";

import Knob from "~/components/knob";
import SelectBox from "~/components/select-box";
import TitleBar from "~/components/title-bar";

import type { ImpulseName } from "./impulses";
import type { AudioNodeConnection } from "~/types";

export default memo(function Reverb({
	label,
	wetDryRatio,
	connections,
	impulse,
	onWetDryRatioChange,
	onLabelChange,
	onImpulseChange,
	remove,
}: ReverbProps) {
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

			onImpulseChange(nextImpulse);
		},
		[onImpulseChange],
	);

	return (
		<div className="w-full">
			{titleBar}
			<div className="flex w-full items-start gap-2">
				<SelectBox
					options={impulseOptions}
					onChange={handleImpulseChange}
					value={impulse}
				/>
				<div className="w-12 shrink-0 grow-0">{wetDryKnob}</div>
			</div>
		</div>
	);
});

export type ReverbProps = {
	label: string;
	wetDryRatio: number;
	isActive: boolean;
	connections: AudioNodeConnection[];
	impulse: ImpulseName;
	onWetDryRatioChange(wetDryRatio: number): unknown;
	onLabelChange(label: string): unknown;
	onImpulseChange(impulse: ImpulseName): unknown;
	remove(): unknown;
};

const impulseOptions: { value: ImpulseName; label: string }[] = [
	{ value: "wide", label: "Wide" },
	{ value: "tight", label: "Tight" },
];

function isValidImpulse(value: string): value is ImpulseName {
	const names = impulseOptions.map((option) => option.value);

	return names.includes(value as ImpulseName);
}
