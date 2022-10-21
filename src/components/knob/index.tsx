import { memo, useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { clamp, noop } from "lodash";

import { layoutAbsoluteFill } from "~/style/layout";

import useControlResponseRef from "../hooks/use-control-response-ref";
import SVGArc from "./svg-arc";
import usePointerDrag from "../hooks/use-pointer-drag";

import type { PointerDragMoveHandler } from "../hooks/use-pointer-drag";
import type { ControlResponseMultipliers } from "../hooks/use-control-response-ref";
import type { FC } from "react";

const Knob: FC<{
	value: number;
	defaultValue?: number;
	radius?: number | string;
	title?: string;
	label?: string;
	valueLabel?: string;
	onChange?(value: number): unknown;
}> = ({
	value,
	defaultValue = 0.5,
	radius = "2.4em",
	title = "",
	label = "",
	valueLabel = "",
	onChange = noop,
}) => {
	const theme = useTheme();
	const knobRef = useRef<HTMLDivElement | null>(null);
	const valueRef = useRef<number>(value);
	const [axis, setAxis] = useState<MovementAxis | undefined>();
	const moveMultiplierRef = useControlResponseRef(controlMultipliers);

	const resetAxis = useCallback(() => setAxis(undefined), []);

	const handleDoubleClick = useCallback(() => {
		onChange(defaultValue);
	}, [onChange, defaultValue]);

	const onDragMove = useCallback<PointerDragMoveHandler>(
		({ movementX, movementY }) => {
			const { current: knob } = knobRef;

			if (!knob) return;

			const moveAxis =
				axis ||
				(Math.abs(movementX) > Math.abs(movementY) ? "horizontal" : "vertical");

			const move =
				moveAxis === "horizontal"
					? movementX / knob.offsetWidth
					: -movementY / knob.offsetHeight;

			onChange(clampMove(valueRef.current + move * moveMultiplierRef.current));

			if (!axis) setAxis(moveAxis);
		},
		[axis, onChange, moveMultiplierRef],
	);

	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	const dragHandlers = usePointerDrag({
		onDragMove,
		onDragStart: resetAxis,
		onDragEnd: resetAxis,
	});

	return (
		<Container title={title}>
			<Label>{label}</Label>
			<KnobContainer
				{...dragHandlers}
				radius={radius}
				axis={axis}
				onDoubleClick={handleDoubleClick}
				role="presentation"
				ref={knobRef}
			>
				<KnobSVGContainer>
					<SVGArc
						endRatio={value}
						strokeWidth={6}
						backgroundStrokeWidth={3}
						strokeColor={theme.colors.text[600]}
						backgroundStrokeColor={theme.colors.text[100]}
					/>
				</KnobSVGContainer>
			</KnobContainer>
			<Label>{valueLabel}</Label>
		</Container>
	);
};

export default memo(Knob);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	inline-size: 100%;
	block-size: 100%;
`;

const Label = styled.div`
	flex: 0 0 auto;
	font-size: 0.8em;
`;

const KnobContainer = styled.div<{
	radius: number | string;
	axis?: MovementAxis;
}>`
	position: relative;
	flex: 0 0 auto;
	inline-size: ${({ radius }) => radius};
	block-size: ${({ radius }) => radius};
	margin: 0.4em auto 0.3em;
	cursor: ${({ axis }) =>
		!axis ? "move" : axis === "vertical" ? "ns-resize" : "ew-resize"};
`;

const KnobSVGContainer = styled.div`
	${layoutAbsoluteFill}
`;

const clampMove = (value: number) => clamp(value, 0, 1);

const controlMultipliers: ControlResponseMultipliers = {
	normal: 1,
	fine: 0.2,
};

type MovementAxis = "vertical" | "horizontal";
