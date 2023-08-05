import { createMemo } from "solid-js";

// Adapted from https://codepen.io/JMChristensen/pen/Ablch
export default function SVGArc(props: Props) {
	const radius = createMemo(() => 50 - (props.foregroundStrokeWidth ?? 0) / 2);
	const circumference = createMemo(() => 2 * Math.PI * radius());

	return (
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle
				cx="50"
				cy="50"
				r={radius()}
				stroke-width={props.backgroundStrokeWidth}
				class={props.backgroundClassName}
				fill="transparent"
			/>
			<circle
				transform="rotate(-90, 50, 50)"
				cx="50"
				cy="50"
				r={radius()}
				stroke-dasharray={String(circumference())}
				stroke-dashoffset={String((1 - props.endRatio) * circumference())}
				stroke-width={props.foregroundStrokeWidth}
				class={props.foregroundClassName}
				fill="transparent"
			/>
		</svg>
	);
}

type Props = {
	endRatio: number;
	foregroundClassName: string;
	foregroundStrokeWidth?: number;
	backgroundClassName?: string;
	backgroundStrokeWidth?: number;
};
