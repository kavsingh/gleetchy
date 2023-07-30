import { useCallback, useRef } from "react";

import type { PointerEventHandler } from "react";

export default function usePointerDrag({
	onDragStart,
	onDragMove,
	onDragEnd,
}: UsePointerDragProps) {
	const stateRef = useRef(initialState);

	const handleDragMove = useCallback(
		(event: PointerEvent) => {
			const { clientX, clientY, timeStamp } = event;

			stateRef.current = {
				...stateRef.current,
				displacementX: clientX - stateRef.current.startX,
				displacementY: clientY - stateRef.current.startY,
				duration: timeStamp - stateRef.current.startTime,
				movementX: clientX - stateRef.current.x,
				movementY: clientY - stateRef.current.y,
				targetX: clientX - (stateRef.current.targetRect?.left ?? 0),
				targetY: clientY - (stateRef.current.targetRect?.top ?? 0),
				timeStamp,
				x: clientX,
				y: clientY,
			};

			onDragMove?.(stateRef.current);
		},
		[onDragMove],
	);

	const handleDragEnd = useCallback(
		(event: PointerEvent) => {
			event.preventDefault();
			globalThis.window.removeEventListener("pointermove", handleDragMove);
			globalThis.window.removeEventListener("pointerup", handleDragEnd);
			globalThis.window.removeEventListener("pointercancel", handleDragEnd);

			const { clientX, clientY } = event;

			stateRef.current = {
				...stateRef.current,
				displacementX: clientX - stateRef.current.startX,
				displacementY: clientY - stateRef.current.startY,
				duration: event.timeStamp - stateRef.current.startTime,
				isDragging: false,
				movementX: clientX - stateRef.current.x,
				movementY: clientY - stateRef.current.y,
				targetX: clientX - (stateRef.current.targetRect?.left ?? 0),
				targetY: clientY - (stateRef.current.targetRect?.top ?? 0),
				timeStamp: event.timeStamp,
				x: clientX,
				y: clientY,
			};

			onDragEnd?.(stateRef.current);
		},
		[onDragEnd, handleDragMove],
	);

	const registerDragStart = useCallback<PointerEventHandler<HTMLElement>>(
		(event) => {
			event.preventDefault();

			if (stateRef.current.isDragging) return;

			const { currentTarget, clientX, clientY, timeStamp } = event;
			const targetRect = currentTarget.getBoundingClientRect();
			const targetStartX = clientX - targetRect.top;
			const targetStartY = clientY - targetRect.left;

			globalThis.window.addEventListener("pointermove", handleDragMove, {
				passive: false,
			});

			globalThis.window.addEventListener("pointerup", handleDragEnd, {
				passive: false,
				once: true,
			});

			globalThis.window.addEventListener("pointercancel", handleDragEnd, {
				passive: false,
				once: true,
			});

			stateRef.current = {
				displacementX: 0,
				displacementY: 0,
				duration: 0,
				isDragging: true,
				movementX: 0,
				movementY: 0,
				startTime: timeStamp,
				startX: clientX,
				startY: clientY,
				target: currentTarget,
				targetRect,
				targetStartX,
				targetStartY,
				targetX: targetStartX,
				targetY: targetStartY,
				timeStamp,
				x: clientX,
				y: clientY,
			};

			onDragStart?.(stateRef.current);
		},
		[onDragStart, handleDragMove, handleDragEnd],
	);

	return { onPointerDown: registerDragStart } as const;
}

const initialState: PointerDragState = {
	displacementX: 0,
	displacementY: 0,
	duration: 0,
	isDragging: false,
	movementX: 0,
	movementY: 0,
	startTime: 0,
	startX: 0,
	startY: 0,
	target: null,
	targetRect: null,
	targetStartX: 0,
	targetStartY: 0,
	targetX: 0,
	targetY: 0,
	timeStamp: 0,
	x: 0,
	y: 0,
};

export type PointerDragState = {
	displacementX: number;
	displacementY: number;
	duration: number;
	isDragging: boolean;
	movementX: number;
	movementY: number;
	startTime: number;
	startX: number;
	startY: number;
	target: HTMLElement | null;
	targetRect: DOMRect | null;
	targetStartX: number;
	targetStartY: number;
	targetX: number;
	targetY: number;
	timeStamp: number;
	x: number;
	y: number;
};

export type PointerDragStartHandler = (state: PointerDragState) => void;

export type PointerDragMoveHandler = (state: PointerDragState) => void;

export type PointerDragEndHandler = (state: PointerDragState) => void;

export type UsePointerDragProps = {
	onDragStart?: PointerDragStartHandler;
	onDragMove?: PointerDragMoveHandler;
	onDragEnd?: PointerDragEndHandler;
};
