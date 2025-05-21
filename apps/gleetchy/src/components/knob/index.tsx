import { createMemo, createSignal, mergeProps } from "solid-js";

import { clamp } from "#lib/util/number";
import { tj } from "#style";

import useControlResponseMultiplier from "../hooks/use-control-response-multiplier";
import usePointerDrag from "../hooks/use-pointer-drag";

import SVGArc from "./svg-arc";

import type { ControlResponseMultipliers } from "../hooks/use-control-response-multiplier";
import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { ParentProps } from "solid-js";

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
	const radius = createMemo(() => {
		return typeof props.radius === "string"
			? props.radius
			: `${props.radius}px`;
	});

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
		<div title={props.title} class="flex size-full flex-col items-center">
			<Label>{props.label}</Label>
			<div
				{...dragHandlers}
				role="presentation"
				onDblClick={handleDoubleClick}
				ref={(el) => (knobRef = el)}
				style={{ "block-size": radius(), "inline-size": radius() }}
				class={tj(
					"relative my-auto mt-2 mb-1 shrink-0 grow-0",
					axis() === "vertical" && "cursor-ns-resize",
					axis() === "horizontal" && "cursor-ew-resize",
				)}
			>
				<div class="absolute inset-0">
					<SVGArc
						endRatio={props.value}
						foregroundStrokeWidth={6}
						backgroundStrokeWidth={3}
						foregroundClassName="stroke-emphasis-600"
						backgroundClassName="stroke-emphasis-100"
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
