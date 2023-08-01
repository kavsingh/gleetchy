import Knob from "~/components/knob";
import SelectBox from "~/components/select-box";
import TitleBar from "~/components/title-bar";

import type { ImpulseName } from "./impulses";
import type { AudioNodeConnection } from "~/types";

export default function Reverb(props: ReverbProps) {
	function handleImpulseChange(nextImpulse: string) {
		if (!isValidImpulse(nextImpulse)) return;

		props.onImpulseChange(nextImpulse);
	}

	return (
		<div class="w-full">
			<TitleBar
				type="Reverb"
				label={props.label}
				connections={props.connections}
				onLabelChange={(label) => props.onLabelChange(label)}
				onRemoveClick={() => props.remove()}
			/>
			<div class="flex w-full items-start gap-2">
				<SelectBox
					options={impulseOptions}
					onChange={handleImpulseChange}
					value={props.impulse}
				/>
				<div class="w-12 shrink-0 grow-0">
					<Knob
						radius="2.4em"
						value={props.wetDryRatio}
						onChange={(val) => props.onWetDryRatioChange(val)}
						label="W / D"
						title="Wet / Dry Ratio"
						valueLabel={`${(props.wetDryRatio * 100).toFixed(1)}%`}
					/>
				</div>
			</div>
		</div>
	);
}

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
