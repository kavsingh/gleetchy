import { memo, useRef, useEffect, useCallback, forwardRef } from "react";
import { clamp, noop } from "lodash";

import { tcx } from "~/lib/css";

import useControlResponseRef from "./hooks/use-control-response-ref";
import usePointerDrag from "./hooks/use-pointer-drag";

import type {
	DetailedHTMLProps,
	HTMLAttributes,
	PropsWithChildren,
} from "react";
import type {
	PointerDragEndHandler,
	PointerDragMoveHandler,
} from "./hooks/use-pointer-drag";
import type { ControlResponseMultipliers } from "./hooks/use-control-response-ref";

export default memo(function Slider({
	value,
	defaultValue = 0.5,
	orientation = "block",
	label = "",
	valueLabel = "",
	title = "",
	onChange = noop,
}: Props) {
	const valueRef = useRef<number>(value);
	const moveMultiplierRef = useControlResponseRef(controlMultipliers);
	const barContainerRef = useRef<HTMLDivElement | null>(null);
	const barRef = useRef<HTMLDivElement | null>(null);

	const handleDoubleClick = useCallback(() => {
		onChange(defaultValue);
	}, [onChange, defaultValue]);

	const onDragMove = useCallback<PointerDragMoveHandler>(
		({ movementX, movementY }) => {
			const { current: bar } = barContainerRef;

			if (!bar) return;

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

			if (!bar) return;

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
			className={tcx("flex items-stretch bs-full is-full", {
				["flex-col items-center"]: orientation === "block",
			})}
		>
			<LabelText
				className={tcx({
					["flex items-center is-12"]: orientation === "inline",
					["bs-6"]: orientation === "block",
				})}
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
				className={tcx({
					["items-center is-12"]: orientation === "inline",
					["items-end bs-6"]: orientation === "block",
				})}
			>
				{valueLabel}
			</LabelText>
		</div>
	);
});

function LabelText({
	className,
	children,
}: PropsWithChildren<{ className: string }>) {
	return (
		<div
			className={tcx(
				"shrink-0 grow-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm",
				className,
			)}
		>
			{children}
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
			className={tcx("relative grow", {
				["is-full mbs-2 mbe-1 mli-auto cursor-ew-resize "]:
					orientation === "inline",
				["bs-full mlb-auto mli-2 cursor-ns-resize"]: orientation === "block",
			})}
		>
			{children}
		</div>
	);
});

function Track({ orientation }: OrientationProps) {
	return (
		<div
			className={tcx("absolute z-[1] bg-text100", {
				["block-start-1/2 inset-inline-0 bs-[1px]"]: orientation === "inline",
				["inset-block-0 inline-start-1/2 is-[1px]"]: orientation === "block",
			})}
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
			className={tcx("absolute z-[2] bg-text600", {
				["origin-left scale-x-0 bs-[3px] inset-inline-0 block-start-[calc(50%-1px)]"]:
					orientation === "inline",
				["origin-bottom scale-y-0 is-[3px] inset-block-0 inline-start-[calc(50%-1px)]"]:
					orientation === "block",
			})}
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
	onChange?(value: number): unknown;
};

type OrientationProps = { orientation: Orientation };

type Orientation = "inline" | "block";
