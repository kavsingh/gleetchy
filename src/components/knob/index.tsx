import { memo, useState, useRef, useCallback, useEffect } from "react";
import { clamp, noop } from "lodash";

import { tcx } from "~/lib/css";

import useControlResponseRef from "../hooks/use-control-response-ref";
import SVGArc from "./svg-arc";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { PropsWithChildren } from "react";
import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { ControlResponseMultipliers } from "../hooks/use-control-response-ref";

export default memo(function Knob({
	value,
	defaultValue = 0.5,
	radius = "2.4em",
	title = "",
	label = "",
	valueLabel = "",
	onChange = noop,
}: Props) {
	const knobRef = useRef<HTMLDivElement | null>(null);
	const valueRef = useRef<number>(value);
	const [axis, setAxis] = useState<MovementAxis | undefined>();
	const moveMultiplierRef = useControlResponseRef(controlMultipliers);

	const resetAxis = useCallback(() => setAxis(undefined), []);

	const handleDoubleClick = useCallback(() => {
		onChange(defaultValue);
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

			onChange(clampMove(valueRef.current + move * moveMultiplierRef.current));

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
		<div title={title} className="flex flex-col items-center bs-full is-full">
			<Label>{label}</Label>
			<div
				{...dragHandlers}
				role="presentation"
				onDoubleClick={handleDoubleClick}
				ref={knobRef}
				style={{ blockSize: radius, inlineSize: radius }}
				className={tcx("relative shrink-0 grow-0 mli-auto mbs-2 mbe-1", {
					["cursor-ns-resize"]: axis === "vertical",
					["cursor-ew-resize"]: axis === "horizontal",
				})}
			>
				<div className="absolute inset-0">
					<SVGArc
						endRatio={value}
						strokeWidth={6}
						backgroundStrokeWidth={3}
						strokeColor="#fff"
						backgroundStrokeColor="eee"
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
	onChange?(value: number): unknown;
};

type MovementAxis = "vertical" | "horizontal";
