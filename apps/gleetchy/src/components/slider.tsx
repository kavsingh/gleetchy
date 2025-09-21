import { createEffect, mergeProps, splitProps } from "solid-js";

import { clamp } from "#lib/util/number";
import { tj, tm } from "#style";

import useControlResponseMultiplier from "./hooks/use-control-response-multiplier";
import usePointerDrag from "./hooks/use-pointer-drag";

import type { ControlResponseMultipliers } from "./hooks/use-control-response-multiplier";
import type {
	PointerDragEndHandler,
	PointerDragMoveHandler,
} from "./hooks/use-pointer-drag";
import type { ComponentProps } from "solid-js";

export default function Slider(_props: Props) {
	const props = mergeProps(
		{
			defaultValue: 0.5,
			orientation: "block",
			label: "",
			valueLabel: "",
			title: "",
		} satisfies Partial<Props>,
		_props,
	);
	const moveMultiplier = useControlResponseMultiplier(controlMultipliers);
	let barContainerRef: HTMLDivElement | undefined;
	let barRef: HTMLDivElement | undefined;

	function handleDoubleClick() {
		props.onChange?.(props.defaultValue);
	}

	const onDragMove: PointerDragMoveHandler = ({ movementX, movementY }) => {
		if (!(barContainerRef && props.onChange)) return;

		const isVert = props.orientation === "block";
		const movement = isVert ? movementY : movementX;
		const dim = isVert
			? barContainerRef.offsetHeight * -1
			: barContainerRef.offsetWidth;

		props.onChange(
			clampValue((movement * moveMultiplier()) / dim + props.value),
		);
	};

	const onDragEnd: PointerDragEndHandler = ({
		duration,
		movementX,
		movementY,
		targetX,
		targetY,
	}) => {
		if (!(barContainerRef && props.onChange)) return;

		const isVert = props.orientation === "block";
		const movement = isVert ? movementY : movementX;

		if (duration > 300 || movement > 4) return;

		const offset = isVert ? targetY : targetX;
		const dim = isVert
			? barContainerRef.offsetHeight
			: barContainerRef.offsetWidth;

		props.onChange(clampValue(isVert ? 1 - offset / dim : offset / dim));
	};

	createEffect(() => {
		if (!barRef) return;

		barRef.style.scale =
			props.orientation === "inline" ? `${props.value} 1` : `1 ${props.value}`;
	});

	const dragHandlers = usePointerDrag({ onDragMove, onDragEnd });

	return (
		<div
			title={props.title}
			class={tj(
				"flex size-full",
				props.orientation === "block"
					? "flex-col items-center cursor-ns-resize"
					: "items-stretch cursor-ew-resize",
			)}
			onDblClick={handleDoubleClick}
			{...dragHandlers}
		>
			<LabelText
				class={tj(
					props.orientation === "inline" && "flex w-12 items-center",
					props.orientation === "block" && "h-6",
				)}
			>
				{props.label}
			</LabelText>
			<BarContainer
				orientation={props.orientation}
				ref={(el) => (barContainerRef = el)}
			>
				<Track orientation={props.orientation} />
				<Bar orientation={props.orientation} ref={(el) => (barRef = el)} />
			</BarContainer>
			<LabelText
				class={tj(
					props.orientation === "inline" && "w-12 items-center",
					props.orientation === "block" && "h-6 items-end",
				)}
			>
				{props.valueLabel}
			</LabelText>
		</div>
	);
}

function LabelText(props: Pick<ComponentProps<"div">, "class" | "children">) {
	return (
		<div class={tm("shrink-0 grow-0 truncate text-sm", props.class)}>
			{props.children}
		</div>
	);
}

function BarContainer(props: BarContainerProps) {
	const [local, divProps] = splitProps(props, ["ref", "orientation"]);

	return (
		<div
			{...divProps}
			ref={local.ref}
			role="presentation"
			class={tj(
				"relative grow",
				local.orientation === "inline" &&
					"mx-auto mt-2 mb-1 w-full cursor-ew-resize",
				local.orientation === "block" && "mx-2 my-auto h-full cursor-ns-resize",
			)}
		/>
	);
}

interface BarContainerProps extends ComponentProps<"div">, OrientationProps {}

function Track(props: OrientationProps) {
	return (
		<div
			class={tj(
				"absolute z-[1] bg-emphasis-100",
				props.orientation === "inline" && "inset-x-0 top-1/2 h-px",
				props.orientation === "block" && "inset-y-0 start-1/2 w-px",
			)}
		/>
	);
}

function Bar(props: BarProps) {
	return (
		<div
			ref={props.ref}
			class={tj(
				"absolute z-[2] bg-emphasis-600",
				props.orientation === "inline" &&
					"inset-x-0 top-[calc(50%-1px)] h-[2px] origin-left scale-x-0",
				props.orientation === "block" &&
					"inset-y-0 start-[calc(50%-1px)] w-[2px] origin-bottom scale-y-0",
			)}
		/>
	);
}

interface BarProps
	extends OrientationProps,
		Pick<ComponentProps<"div">, "ref"> {}

const clampValue = clamp.bind(null, 0, 1);

const controlMultipliers: ControlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

interface Props {
	value: number;
	defaultValue?: number;
	orientation?: Orientation;
	label?: string;
	valueLabel?: string;
	title?: string;
	onChange?: ((value: number) => unknown) | undefined;
}

interface OrientationProps {
	orientation: Orientation;
}

type Orientation = "inline" | "block";
