import { memo } from "react";

// Adapted from https://codepen.io/JMChristensen/pen/Ablch
export default memo(function SVGArc({
	endRatio,
	foregroundClassName,
	foregroundStrokeWidth = 4,
	backgroundClassName = "transparent",
	backgroundStrokeWidth = 1,
}: Props) {
	const radius = 50 - foregroundStrokeWidth / 2;
	const circumference = 2 * Math.PI * radius;

	return (
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle
				cx="50"
				cy="50"
				r={radius}
				strokeWidth={backgroundStrokeWidth}
				className={backgroundClassName}
				fill="transparent"
			/>
			<circle
				transform="rotate(-90, 50, 50)"
				cx="50"
				cy="50"
				r={radius}
				strokeDasharray={circumference}
				strokeDashoffset={(1 - endRatio) * circumference}
				strokeWidth={foregroundStrokeWidth}
				className={foregroundClassName}
				fill="transparent"
			/>
		</svg>
	);
});

type Props = {
	endRatio: number;
	foregroundClassName: string;
	foregroundStrokeWidth?: number;
	backgroundClassName?: string;
	backgroundStrokeWidth?: number;
};
