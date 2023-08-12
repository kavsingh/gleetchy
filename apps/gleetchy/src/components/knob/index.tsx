import {
	createMemo,
	createSignal,
	mergeProps,
	type ParentProps,
} from "solid-js";
import { twMerge } from "tailwind-merge";

import { clamp } from "~/lib/util/number";

import SVGArc from "./svg-arc";
import useControlResponseMultiplier from "../hooks/use-control-response-multiplier";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { ControlResponseMultipliers } from "../hooks/use-control-response-multiplier";
import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";

export default function Knob(_props: Props) {
	const props = mergeProps(
		{
			defaultValue: 0.5,
			radius: "2.4em",
			title: "",
			label: "",
			valueLabel: "",
		},
		_props,
	);
	let knobRef: HTMLDivElement | undefined;
	const [axis, setAxis] = createSignal<MovementAxis>();
	const moveMultiplierRef = useControlResponseMultiplier(controlMultipliers);
	const radius = createMemo(() =>
		typeof props.radius === "string" ? props.radius : `${props.radius}px`,
	);

	function handleDoubleClick() {
		props.onChange?.(props.defaultValue);
	}

	const onDragMove: PointerDragMoveHandler = ({ movementX, movementY }) => {
		if (!knobRef) return;

		const moveAxis =
			axis() ??
			(Math.abs(movementX) > Math.abs(movementY) ? "horizontal" : "vertical");

		const move =
			moveAxis === "horizontal"
				? movementX / knobRef.offsetWidth
				: -movementY / knobRef.offsetHeight;

		props.onChange?.(clampMove(props.value + move * moveMultiplierRef()));

		if (!axis()) setAxis(moveAxis);
	};

	function resetAxis() {
		setAxis(undefined);
	}

	const dragHandlers = usePointerDrag({
		onDragMove,
		onDragStart: resetAxis,
		onDragEnd: resetAxis,
	});

	return (
		<div title={props.title} class="flex h-full w-full flex-col items-center">
			<Label>{props.label}</Label>
			<div
				{...dragHandlers}
				role="presentation"
				onDblClick={handleDoubleClick}
				ref={knobRef}
				style={{ "block-size": radius(), "inline-size": radius() }}
				class={twMerge(
					"relative my-auto mb-1 mt-2 shrink-0 grow-0",
					axis() === "vertical" && "cursor-ns-resize",
					axis() === "horizontal" && "cursor-ew-resize",
				)}
			>
				<div class="absolute inset-0">
					<SVGArc
						endRatio={props.value}
						foregroundStrokeWidth={6}
						backgroundStrokeWidth={3}
						foregroundClassName="stroke-text600"
						backgroundClassName="stroke-text100"
					/>
				</div>
			</div>
			<Label>{props.valueLabel}</Label>
		</div>
	);
}

function Label(props: ParentProps) {
	return <div class="flex shrink-0 grow-0 text-sm">{props.children}</div>;
}

const clampMove = clamp.bind(null, 0, 1);

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
