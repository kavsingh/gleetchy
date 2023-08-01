import { useCallback, useRef, memo } from "react";
import { twMerge } from "tailwind-merge";

import LoopHandle from "./loop-handle";
import useControlResponseMultiplier from "../hooks/use-control-response-multiplier";
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

function LoopRegion(props: Props) {
	const moveMultiplierRef = useControlResponseMultiplier(
		controlResponseMultipliers,
	);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const handleStartHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(props.onLoopStartDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			props.onLoopStartDrag(movement);
		},
		[props.onLoopStartDrag, moveMultiplierRef],
	);

	const handleEndHandleDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(props.onLoopEndDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			props.onLoopEndDrag(movement);
		},
		[props.onLoopEndDrag, moveMultiplierRef],
	);

	const handleLoopRegionDrag = useCallback<PointerDragMoveHandler>(
		({ movementX }) => {
			if (!(props.onLoopRegionDrag && containerRef.current)) return;

			const movement =
				(movementX * moveMultiplierRef.current) /
				containerRef.current.offsetWidth;

			props.onLoopRegionDrag(movement);
		},
		[props.onLoopRegionDrag, moveMultiplierRef],
	);

	const regionRatio = props.loopEnd - props.loopStart;
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
		<div class="relative h-full w-full" ref={containerRef}>
			<HandleContainer {...startDragListeners} offset={props.loopStart}>
				<LoopHandle align="start" />
			</HandleContainer>
			<HandleContainer {...endDragListeners} offset={props.loopEnd}>
				<LoopHandle align="end" />
			</HandleContainer>
			<div class="absolute inset-0">
				<InactiveRegion start={0} end={props.loopStart} />
				{regionRatio < 1 ? (
					<ActiveRegion
						{...regionDragListeners}
						start={props.loopStart}
						end={props.loopEnd}
						preferred={preferRegionDrag}
					/>
				) : null}
				<InactiveRegion start={props.loopEnd} end={1} />
			</div>
		</div>
	);
}

function HandleContainer(
	_props: PropsWithChildren<{ offset: number } & DivProps>,
) {
	const [props, props] = splitProps(_props, ["children", "offset"]);
	return (
		<div
			{...props}
			className="absolute top-0 z-[1] h-full w-[10px] cursor-ew-resize"
			role="presentation"
			style={{ left: `${props.offset * 100}%` }}
		>
			{props.children}
		</div>
	);
}

function ActiveRegion(_props: RegionProps & { preferred: boolean }) {
	const [props, regionProps] = splitProps(_props, ["preferred"]);
	return (
		<Region
			{...regionProps}
			className={twMerge("z-0 cursor-move", props.preferred && "z-[2]")}
		/>
	);
}

function InactiveRegion(props: RegionProps) {
	return <Region {...props} className="z-0 bg-surface0 opacity-80" />;
}

const Region = memo(function Region(_props: RegionProps) {
	const [props, divProps] = splitProps(_props, ["start", "end", "className"]);
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
