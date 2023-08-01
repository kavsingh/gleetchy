import { Show, createMemo, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import LoopHandle from "./loop-handle";
import useControlResponseMultiplier from "../hooks/use-control-response-multiplier";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { JSX, ParentProps } from "solid-js";

const controlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

export default function LoopRegion(props: Props) {
	const moveMultiplier = useControlResponseMultiplier(
		controlResponseMultipliers,
	);
	let containerRef: HTMLDivElement | undefined;

	const handleStartHandleDrag: PointerDragMoveHandler = ({ movementX }) => {
		if (!(props.onLoopStartDrag && containerRef)) return;

		const movement = (movementX * moveMultiplier()) / containerRef.offsetWidth;

		props.onLoopStartDrag(movement);
	};

	const handleEndHandleDrag: PointerDragMoveHandler = ({ movementX }) => {
		if (!(props.onLoopEndDrag && containerRef)) return;

		const movement = (movementX * moveMultiplier()) / containerRef.offsetWidth;

		props.onLoopEndDrag(movement);
	};

	const handleLoopRegionDrag: PointerDragMoveHandler = ({ movementX }) => {
		if (!(props.onLoopRegionDrag && containerRef)) return;

		const movement = (movementX * moveMultiplier()) / containerRef.offsetWidth;

		props.onLoopRegionDrag(movement);
	};

	const regionRatio = createMemo(() => props.loopEnd - props.loopStart);

	const preferRegionDrag = createMemo(() => {
		return containerRef ? regionRatio() * containerRef.offsetWidth < 30 : false;
	});

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
				<Show when={regionRatio() < 1}>
					<ActiveRegion
						{...regionDragListeners}
						start={props.loopStart}
						end={props.loopEnd}
						preferred={preferRegionDrag()}
					/>
				</Show>
				<InactiveRegion start={props.loopEnd} end={1} />
			</div>
		</div>
	);
}

function HandleContainer(props: ParentProps<{ offset: number } & DivProps>) {
	const [local, ...divProps] = splitProps(props, ["children", "offset"]);

	return (
		<div
			{...divProps}
			class="absolute top-0 z-[1] h-full w-[10px] cursor-ew-resize"
			role="presentation"
			style={{ left: `${local.offset * 100}%` }}
		>
			{props.children}
		</div>
	);
}

function ActiveRegion(props: RegionProps & { preferred: boolean }) {
	const [local, regionProps] = splitProps(props, ["preferred"]);

	return (
		<Region
			{...regionProps}
			class={twMerge("z-0 cursor-move", local.preferred && "z-[2]")}
		/>
	);
}

function InactiveRegion(props: RegionProps) {
	return <Region {...props} class="z-0 bg-surface0 opacity-80" />;
}

function Region(props: RegionProps) {
	const [local, divProps] = splitProps(props, ["start", "end", "class"]);

	return (
		<div
			{...divProps}
			style={{
				left: `${local.start * 100}%`,
				right: `${(1 - local.end) * 100}%`,
			}}
			class={twMerge("absolute inset-y-0", local.class)}
		/>
	);
}

type RegionProps = {
	start: number;
	end: number;
	className?: string;
} & DivProps;

type DivProps = JSX.HTMLAttributes<HTMLDivElement>;

type Props = {
	loopStart: number;
	loopEnd: number;
	onLoopStartDrag?: ((movement: number) => unknown) | undefined;
	onLoopEndDrag?: ((movement: number) => unknown) | undefined;
	onLoopRegionDrag?: ((movement: number) => unknown) | undefined;
};
