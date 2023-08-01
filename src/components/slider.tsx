import { memo, useRef, useEffect, useCallback, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { clamp } from "~/lib/util/number";

import useControlResponseMultiplier from "./hooks/use-control-response-multiplier";
import usePointerDrag from "./hooks/use-pointer-drag";

import type { ControlResponseMultipliers } from "./hooks/use-control-response-multiplier";
import type {
	PointerDragEndHandler,
	PointerDragMoveHandler,
} from "./hooks/use-pointer-drag";
import type {
	DetailedHTMLProps,
	HTMLAttributes,
	PropsWithChildren,
} from "react";

export default memo(function Slider(_props: Props) {
	const props = mergeProps(
		{
			defaultValue: 0.5,
			orientation: "block",
			label: "",
			valueLabel: "",
			title: "",
		},
		_props,
	);
	const valueRef = useRef<number>(value);
	const moveMultiplierRef = useControlResponseMultiplier(controlMultipliers);
	const barContainerRef = useRef<HTMLDivElement | null>(null);
	const barRef = useRef<HTMLDivElement | null>(null);

	const handleDoubleClick = useCallback(() => {
		onChange?.(defaultValue);
	}, [onChange, defaultValue]);

	const onDragMove = useCallback<PointerDragMoveHandler>(
		({ movementX, movementY }) => {
			const { current: bar } = barContainerRef;

			if (!(bar && onChange)) return;

			const isVert = orientation === "block";
			const movement = isVert ? movementY : movementX;
			const dim = isVert ? bar.offsetHeight * -1 : bar.offsetWidth;

			onChange(
				clampValue(
					(movement * moveMultiplierRef.current) / dim + valueRef.current,
				),
			);
		},
		[orientation, onChange, moveMultiplierRef],
	);

	const onDragEnd = useCallback<PointerDragEndHandler>(
		({ duration, movementX, movementY, targetX, targetY }) => {
			const { current: bar } = barContainerRef;

			if (!(bar && onChange)) return;

			const isVert = orientation === "block";
			const movement = isVert ? movementY : movementX;

			if (duration > 300 || movement > 4) return;

			const offset = isVert ? targetY : targetX;
			const dim = isVert ? bar.offsetHeight : bar.offsetWidth;

			onChange(clampValue(isVert ? 1 - offset / dim : offset / dim));
		},
		[orientation, onChange],
	);

	useEffect(() => {
		valueRef.current = value;

		if (barRef.current) {
			barRef.current.style.transform =
				orientation === "inline" ? `scaleX(${value})` : `scaleY(${value})`;
		}
	}, [value, orientation]);

	const dragHandlers = usePointerDrag({ onDragMove, onDragEnd });

	return (
		<div
			title={title}
			class={twMerge(
				"flex h-full w-full items-stretch",
				orientation === "block" && "flex-col items-center",
			)}
		>
			<LabelText
				class={twMerge(
					orientation === "inline" && "flex w-12 items-center",
					orientation === "block" && "h-6",
				)}
			>
				{label}
			</LabelText>
			<BarContainer
				{...dragHandlers}
				orientation={orientation}
				onDoubleClick={handleDoubleClick}
				ref={barContainerRef}
			>
				<Track orientation={orientation} />
				<Bar orientation={orientation} ref={barRef} />
			</BarContainer>
			<LabelText
				class={twMerge(
					orientation === "inline" && "w-12 items-center",
					orientation === "block" && "h-6 items-end",
				)}
			>
				{valueLabel}
			</LabelText>
		</div>
	);
});

function LabelText(props: PropsWithChildren<{ className: string }>) {
	return (
		<div class={twMerge("shrink-0 grow-0 truncate text-sm", props.className)}>
			{props.children}
		</div>
	);
}

const BarContainer = forwardRef<
	HTMLDivElement,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
		OrientationProps
>(function BarContainer({ orientation, children, ...props }, ref) {
	return (
		<div
			{...props}
			ref={ref}
			role="presentation"
			className={twMerge(
				"relative grow",
				orientation === "inline" &&
					"mx-auto mb-1 mt-2 w-full cursor-ew-resize ",
				orientation === "block" && "mx-2 my-auto h-full cursor-ns-resize",
			)}
		>
			{children}
		</div>
	);
});

function Track(props: OrientationProps) {
	return (
		<div
			class={twMerge(
				"absolute z-[1] bg-text100",
				props.orientation === "inline" && "inset-x-0 top-1/2 h-[1px]",
				props.orientation === "block" && "inset-y-0 start-1/2 w-[1px]",
			)}
		/>
	);
}

const Bar = forwardRef<HTMLDivElement, OrientationProps>(function Bar(
	{ orientation },
	ref,
) {
	return (
		<div
			ref={ref}
			class={twMerge(
				"absolute z-[2] bg-text600",
				orientation === "inline" &&
					"inset-x-0 top-[calc(50%-1px)] h-[3px] origin-left scale-x-0",
				orientation === "block" &&
					"inset-y-0 start-[calc(50%-1px)] w-[3px] origin-bottom scale-y-0",
			)}
		/>
	);
});

function clampValue(value: number) {
	return clamp(value, 0, 1);
}

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
