import { useCallback, useRef, memo } from "react";
import { noop } from "lodash";
import { twMerge } from "tailwind-merge";

import { tcx } from "~/lib/css";

import useControlResponseRef from "../hooks/use-control-response-ref";
import LoopHandle from "./loop-handle";
import usePointerDrag from "../hooks/use-pointer-drag";

import type {
	PropsWithChildren,
	DetailedHTMLProps,
	HTMLAttributes,
} from "react";
import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";

export default memo(
	LoopRegion,
	(prevProps, nextProps) =>
		prevProps.loopStart === nextProps.loopStart &&
		prevProps.loopEnd === nextProps.loopEnd,
);

const controlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

function LoopRegion({
	loopStart,
	loopEnd,
	onLoopStartDrag = noop,
	onLoopEndDrag = noop,
	onLoopRegionDrag = noop,
}: Props) {
	const moveMultiplierRef = useControlResponseRef(controlResponseMultipliers);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const handleStartHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (containerRef.current) {
				onLoopStartDrag(
					(movementX * moveMultiplierRef.current) /
						containerRef.current.offsetWidth,
				);
			}
		},
		[onLoopStartDrag, moveMultiplierRef],
	);

	const handleEndHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (containerRef.current) {
				onLoopEndDrag(
					(movementX * moveMultiplierRef.current) /
						containerRef.current.offsetWidth,
				);
			}
		},
		[onLoopEndDrag, moveMultiplierRef],
	);

	const handleLoopRegionDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (containerRef.current) {
				onLoopRegionDrag(
					(movementX * moveMultiplierRef.current) /
						containerRef.current.offsetWidth,
				);
			}
		},
		[onLoopRegionDrag, moveMultiplierRef],
	);

	const regionRatio = loopEnd - loopStart;
	const preferRegionDrag = containerRef.current
		? regionRatio * containerRef.current.offsetWidth < 30
		: false;

	const startDragListeners = usePointerDrag({
		onDragMove: handleStartHandleDrag,
	});
	const regionDragListeners = usePointerDrag({
		onDragMove: handleLoopRegionDrag,
	});
	const endDragListeners = usePointerDrag({ onDragMove: handleEndHandleDrag });

	return (
		<div className="relative bs-full is-full" ref={containerRef}>
			<HandleContainer {...startDragListeners} offset={loopStart}>
				<LoopHandle align="left" />
			</HandleContainer>
			<HandleContainer {...endDragListeners} offset={loopEnd}>
				<LoopHandle align="right" />
			</HandleContainer>
			<div className="absolute inset-0">
				<InactiveRegion start={0} end={loopStart} />
				{regionRatio < 1 ? (
					<ActiveRegion
						{...regionDragListeners}
						start={loopStart}
						end={loopEnd}
						preferred={preferRegionDrag}
					/>
				) : null}
				<InactiveRegion start={loopEnd} end={1} />
			</div>
		</div>
	);
}

function HandleContainer({
	children,
	offset,
	...props
}: PropsWithChildren<{ offset: number } & DivProps>) {
	return (
		<div
			{...props}
			className="absolute top-0 z-[1] h-full w-[10px] cursor-ew-resize"
			role="presentation"
			style={{ left: `${offset * 100}%` }}
		>
			{children}
		</div>
	);
}

function ActiveRegion({
	preferred,
	...regionProps
}: RegionProps & { preferred: boolean }) {
	return (
		<Region
			{...regionProps}
			className={tcx("z-0 cursor-move", { ["z-[2]"]: preferred })}
		/>
	);
}

function InactiveRegion(props: RegionProps) {
	return <Region {...props} className="z-0 bg-surface0 opacity-80" />;
}

const Region = memo(function Region({
	start,
	end,
	className,
	...divProps
}: RegionProps) {
	return (
		<div
			{...divProps}
			style={{ left: `${start * 100}%`, right: `${(1 - end) * 100}%` }}
			className={twMerge("absolute top-0 bottom-0", className)}
		/>
	);
});

type RegionProps = {
	start: number;
	end: number;
	className?: string;
} & DivProps;

type DivProps = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

type Props = {
	loopStart: number;
	loopEnd: number;
	onLoopStartDrag?(movement: number): unknown;
	onLoopEndDrag?(movement: number): unknown;
	onLoopRegionDrag?(movement: number): unknown;
};
