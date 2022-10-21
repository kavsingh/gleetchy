import { memo, useRef, useEffect, useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { clamp, noop } from "lodash";

import useControlResponseRef from "./hooks/use-control-response-ref";
import usePointerDrag from "./hooks/use-pointer-drag";

import type { FC } from "react";
import type {
	PointerDragEndHandler,
	PointerDragMoveHandler,
} from "./hooks/use-pointer-drag";
import type { ControlResponseMultipliers } from "./hooks/use-control-response-ref";

const Slider: FC<{
	value: number;
	defaultValue?: number;
	orientation?: Orientation;
	label?: string;
	valueLabel?: string;
	title?: string;
	onChange?(value: number): unknown;
}> = ({
	value,
	defaultValue = 0.5,
	orientation = "block",
	label = "",
	valueLabel = "",
	title = "",
	onChange = noop,
}) => {
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
		<Container orientation={orientation} title={title}>
			<Label orientation={orientation}>{label}</Label>

			<BarContainer
				{...dragHandlers}
				orientation={orientation}
				role="presentation"
				onDoubleClick={handleDoubleClick}
				ref={barContainerRef}
			>
				<Track orientation={orientation} />
				<Bar orientation={orientation} ref={barRef} />
			</BarContainer>
			<ValueLabel orientation={orientation}>{valueLabel}</ValueLabel>
		</Container>
	);
};

export default memo(Slider);

const Container = styled.div<OrientationProps>`
	display: flex;
	inline-size: 100%;
	block-size: 100%;
	${({ orientation }) =>
		orientation === "inline"
			? css`
					flex-direction: row;
					align-items: stretch;
			  `
			: css`
					flex-direction: column;
					align-items: center;
			  `}
`;

const Text = styled.div`
	flex: 0 0 auto;
	overflow: hidden;
	font-size: 0.8em;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const Label = styled(Text)<OrientationProps>`
	${({ orientation }) =>
		orientation === "inline"
			? css`
					display: flex;
					align-items: center;
					inline-size: 3em;
			  `
			: css`
					block-size: 1.4em;
			  `};
`;

const ValueLabel = styled(Text)<OrientationProps>`
	display: flex;
	${({ orientation }) =>
		orientation === "inline"
			? css`
					align-items: center;
					inline-size: 3em;
			  `
			: css`
					align-items: flex-end;
					block-size: 1.4em;
			  `};
`;

const BarContainer = styled.div<OrientationProps>`
	position: relative;
	flex: 1 1;
	${({ orientation }) =>
		orientation === "inline"
			? css`
					block-size: 100%;
					margin: auto 0.6em;
					cursor: ew-resize;
			  `
			: css`
					inline-size: 100%;
					margin: 0.4em auto 0.2em;
					cursor: ns-resize;
			  `}
`;

const Track = styled.div<OrientationProps>`
	position: absolute;
	z-index: 1;
	background-color: ${({ theme }) => theme.colors.text[100]};
	${({ orientation }) =>
		orientation === "inline"
			? css`
					inset-block-start: 50%;
					inset-inline: 0;
					block-size: 1px;
			  `
			: css`
					inset-block: 0;
					inset-inline-start: 50%;
					inline-size: 1px;
			  `};
`;

const Bar = styled.div<OrientationProps>`
	position: absolute;
	z-index: 2;
	background-color: ${({ theme }) => theme.colors.text[600]};
	${({ orientation }) =>
		orientation === "inline"
			? css`
					inset-block-start: calc(50% - 1px);
					inset-inline: 0;
					block-size: 3px;
					transform: scaleX(0);
					transform-origin: left;
			  `
			: css`
					inset-block: 0;
					inset-inline-start: calc(50% - 1px);
					inline-size: 3px;
					transform: scaleY(0);
					transform-origin: bottom;
			  `};
`;

const clampValue = (value: number) => clamp(value, 0, 1);

const controlMultipliers: ControlResponseMultipliers = {
	normal: 1,
	fine: 0.4,
};

type Orientation = "inline" | "block";

type OrientationProps = { orientation: Orientation };
