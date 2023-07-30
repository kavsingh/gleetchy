import { useCallback, useRef, memo } from "react";
import { twMerge } from "tailwind-merge";

import LoopHandle from "./loop-handle";
import useControlResponseRef from "../hooks/use-control-response-ref";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type {
	PropsWithChildren,
	DetailedHTMLProps,
	HTMLAttributes,
} from "react";

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
	onLoopStartDrag,
	onLoopEndDrag,
	onLoopRegionDrag,
}: Props) {
	const moveMultiplierRef = useControlResponseRef(controlResponseMultipliers);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const handleStartHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(onLoopStartDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			onLoopStartDrag(movement);
		},
		[onLoopStartDrag, moveMultiplierRef],
	);

	const handleEndHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(onLoopEndDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			onLoopEndDrag(movement);
		},
		[onLoopEndDrag, moveMultiplierRef],
	);

	const handleLoopRegionDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(onLoopRegionDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			onLoopRegionDrag(movement);
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
		<div className="relative h-full w-full" ref={containerRef}>
			<HandleContainer {...startDragListeners} offset={loopStart}>
				<LoopHandle align="start" />
			</HandleContainer>
			<HandleContainer {...endDragListeners} offset={loopEnd}>
				<LoopHandle align="end" />
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
			className={twMerge("z-0 cursor-move", preferred && "z-[2]")}
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
			className={twMerge("absolute inset-y-0", className)}
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
	onLoopStartDrag?: ((movement: number) => unknown) | undefined;
	onLoopEndDrag?: ((movement: number) => unknown) | undefined;
	onLoopRegionDrag?: ((movement: number) => unknown) | undefined;
};
