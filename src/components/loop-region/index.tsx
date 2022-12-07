import { useCallback, useRef, memo } from "react";
import styled from "@emotion/styled";
import { memoize, noop } from "lodash";
import color from "color";

import { layoutAbsoluteFill } from "~/style/layout";

import useControlResponseRef from "../hooks/use-control-response-ref";
import LoopHandle from "./loop-handle";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { FC } from "react";

const controlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

const LoopRegion: FC<{
	loopStart: number;
	loopEnd: number;
	onLoopStartDrag?(movement: number): unknown;
	onLoopEndDrag?(movement: number): unknown;
	onLoopRegionDrag?(movement: number): unknown;
}> = ({
	loopStart,
	loopEnd,
	onLoopStartDrag = noop,
	onLoopEndDrag = noop,
	onLoopRegionDrag = noop,
}) => {
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
		<Container ref={containerRef}>
			<HandleContainer
				{...startDragListeners}
				role="presentation"
				offset={loopStart}
			>
				<LoopHandle align="left" />
			</HandleContainer>

			<HandleContainer
				{...endDragListeners}
				role="presentation"
				offset={loopEnd}
			>
				<LoopHandle align="right" />
			</HandleContainer>
			<RegionsContainer>
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
			</RegionsContainer>
		</Container>
	);
};

export default memo(
	LoopRegion,
	(prevProps, nextProps) =>
		prevProps.loopStart === nextProps.loopStart &&
		prevProps.loopEnd === nextProps.loopEnd,
);

const Container = styled.div`
	position: relative;
	inline-size: 100%;
	block-size: 100%;
`;

const HandleContainer = styled.div<{ offset: number }>`
	position: absolute;
	top: 0;
	left: ${({ offset }) => offset * 100}%;
	z-index: 1;
	width: 10px;
	height: 100%;
	cursor: ew-resize;
`;

const RegionsContainer = styled.div`
	${layoutAbsoluteFill}
`;

const Region = styled.div<{ start: number; end: number }>`
	position: absolute;
	top: 0;
	right: ${({ end }) => `${(1 - end) * 100}%`};
	bottom: 0;
	left: ${({ start }) => `${start * 100}%`};
`;

const ActiveRegion = styled(Region)<{
	preferred: boolean;
}>`
	z-index: ${({ preferred }) => (preferred ? 2 : 0)};
	cursor: move;
`;

const inactiveOverlayColor = memoize((baseColor: string) =>
	color(baseColor).alpha(0.8).string(),
);

const InactiveRegion = styled(Region)`
	z-index: 0;
	background-color: ${({ theme }) =>
		inactiveOverlayColor(theme.colors.surface[0])};
`;
