import { clamp } from "lodash";
import { memo, useState, useRef, useCallback, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import SVGArc from "./svg-arc";
import useControlResponseRef from "../hooks/use-control-response-ref";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { ControlResponseMultipliers } from "../hooks/use-control-response-ref";
import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { PropsWithChildren } from "react";

export default memo(function Knob({
	value,
	defaultValue = 0.5,
	radius = "2.4em",
	title = "",
	label = "",
	valueLabel = "",
	onChange,
}: Props) {
	const knobRef = useRef<HTMLDivElement | null>(null);
	const valueRef = useRef<number>(value);
	const [axis, setAxis] = useState<MovementAxis | undefined>();
	const moveMultiplierRef = useControlResponseRef(controlMultipliers);

	const resetAxis = useCallback(() => {
		setAxis(undefined);
	}, []);

	const handleDoubleClick = useCallback(() => {
		onChange?.(defaultValue);
	}, [onChange, defaultValue]);

	const onDragMove = useCallback<PointerDragMoveHandler>(
		({ movementX, movementY }) => {
			const { current: knob } = knobRef;

			if (!knob) return;

			const moveAxis =
				axis ??
				(Math.abs(movementX) > Math.abs(movementY) ? "horizontal" : "vertical");

			const move =
				moveAxis === "horizontal"
					? movementX / knob.offsetWidth
					: -movementY / knob.offsetHeight;

			onChange?.(
				clampMove(valueRef.current + move * moveMultiplierRef.current),
			);

			if (!axis) setAxis(moveAxis);
		},
		[axis, onChange, moveMultiplierRef],
	);

	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	const dragHandlers = usePointerDrag({
		onDragMove,
		onDragStart: resetAxis,
		onDragEnd: resetAxis,
	});

	return (
		<div title={title} className="flex h-full w-full flex-col items-center">
			<Label>{label}</Label>
			<div
				{...dragHandlers}
				role="presentation"
				onDoubleClick={handleDoubleClick}
				ref={knobRef}
				style={{ blockSize: radius, inlineSize: radius }}
				className={twMerge(
					"relative my-auto mb-1 mt-2 shrink-0 grow-0",
					axis === "vertical" && "cursor-ns-resize",
					axis === "horizontal" && "cursor-ew-resize",
				)}
			>
				<div className="absolute inset-0">
					<SVGArc
						endRatio={value}
						foregroundStrokeWidth={6}
						backgroundStrokeWidth={3}
						foregroundClassName="stroke-text600"
						backgroundClassName="stroke-text100"
					/>
				</div>
			</div>
			<Label>{valueLabel}</Label>
		</div>
	);
});

function Label({ children }: PropsWithChildren) {
	return <div className="flex shrink-0 grow-0 text-sm">{children}</div>;
}

function clampMove(value: number) {
	return clamp(value, 0, 1);
}

const controlMultipliers: ControlResponseMultipliers = {
	normal: 1,
	fine: 0.2,
};

type Props = {
	value: number;
	defaultValue?: number;
	radius?: number | string;
	title?: string;
	label?: string;
	valueLabel?: string;
	onChange?: ((value: number) => unknown) | undefined;
};

type MovementAxis = "vertical" | "horizontal";
