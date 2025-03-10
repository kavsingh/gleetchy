import { createEffect, mergeProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import { clamp } from "#lib/util/number";

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

		barRef.style.transform =
			props.orientation === "inline"
				? `scaleX(${props.value})`
				: `scaleY(${props.value})`;
	});

	const dragHandlers = usePointerDrag({ onDragMove, onDragEnd });

	return (
		<div
			title={props.title}
			class={twMerge(
				"flex size-full items-stretch",
				props.orientation === "block" && "flex-col items-center",
			)}
		>
			<LabelText
				class={twMerge(
					props.orientation === "inline" && "flex w-12 items-center",
					props.orientation === "block" && "h-6",
				)}
			>
				{props.label}
			</LabelText>
			<BarContainer
				{...dragHandlers}
				orientation={props.orientation}
				onDblClick={handleDoubleClick}
				ref={(el) => (barContainerRef = el)}
			>
				<Track orientation={props.orientation} />
				<Bar orientation={props.orientation} ref={(el) => (barRef = el)} />
			</BarContainer>
			<LabelText
				class={twMerge(
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
		<div class={twMerge("shrink-0 grow-0 truncate text-sm", props.class)}>
			{props.children}
		</div>
	);
}

function BarContainer(props: ComponentProps<"div"> & OrientationProps) {
	const [local, divProps] = splitProps(props, ["ref", "orientation"]);

	return (
		<div
			{...divProps}
			ref={local.ref}
			role="presentation"
			class={twMerge(
				"relative grow",
				local.orientation === "inline" &&
					"mx-auto mb-1 mt-2 w-full cursor-ew-resize ",
				local.orientation === "block" && "mx-2 my-auto h-full cursor-ns-resize",
			)}
		/>
	);
}

function Track(props: OrientationProps) {
	return (
		<div
			class={twMerge(
				"absolute z-[1] bg-text100",
				props.orientation === "inline" && "inset-x-0 top-1/2 h-px",
				props.orientation === "block" && "inset-y-0 start-1/2 w-px",
			)}
		/>
	);
}

function Bar(props: OrientationProps & Pick<ComponentProps<"div">, "ref">) {
	return (
		<div
			ref={props.ref}
			class={twMerge(
				"absolute z-[2] bg-text600",
				props.orientation === "inline" &&
					"inset-x-0 top-[calc(50%-1px)] h-[2px] origin-left scale-x-0",
				props.orientation === "block" &&
					"inset-y-0 start-[calc(50%-1px)] w-[2px] origin-bottom scale-y-0",
			)}
		/>
	);
}

const clampValue = clamp.bind(null, 0, 1);

const controlMultipliers: ControlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

type Props = {
	value: number;
	defaultValue?: number;
	orientation?: Orientation;
	label?: string;
	valueLabel?: string;
	title?: string;
	onChange?: ((value: number) => unknown) | undefined;
};

type OrientationProps = { orientation: Orientation };

type Orientation = "inline" | "block";
