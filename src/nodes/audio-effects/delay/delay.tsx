import Knob from "~/components/knob";
import TitleBar from "~/components/title-bar";
import { DELAY_UPPER_BOUND } from "~/constants/audio";

import type { ParentProps } from "solid-js";
import type { AudioNodeConnection } from "~/types";

export default function Delay(props: ParentProps<DelayProps>) {
	function handleTimeKnobChange(val: number) {
		props.onDelayTimeChange(val * DELAY_UPPER_BOUND);
	}

	return (
		<div class="w-full">
			<TitleBar
				type="Delay"
				label={props.label}
				connections={props.connections}
				onLabelChange={(label) => props.onLabelChange(label)}
				onRemoveClick={() => props.remove()}
			/>
			<div class="flex w-full">
				<KnobContainer>
					<Knob
						radius="2.4em"
						value={props.delayTime / DELAY_UPPER_BOUND}
						onChange={handleTimeKnobChange}
						label="T"
						title="Delay Time"
						valueLabel={props.delayTime.toFixed(2)}
					/>
				</KnobContainer>
				<KnobContainer>
					<Knob
						radius="2.4em"
						value={props.wetDryRatio}
						onChange={(val) => props.onWetDryRatioChange(val)}
						label="W / D"
						title="Wet / Dry Ratio"
						valueLabel={`${(props.wetDryRatio * 100).toFixed(1)}%`}
					/>
				</KnobContainer>
			</div>
		</div>
	);
}

function KnobContainer(props: ParentProps) {
	return <div class="w-12 shrink-0 grow-0">{props.children}</div>;
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
