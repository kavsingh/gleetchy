import type { JSX } from "solid-js";

export default function usePointerDrag(props: UsePointerDragProps) {
	let state = { ...initialState };

	function handleDragMove(event: PointerEvent) {
		const { clientX, clientY, timeStamp } = event;

		state = {
			...state,
			timeStamp,
			displacementX: clientX - state.startX,
			displacementY: clientY - state.startY,
			duration: timeStamp - state.startTime,
			movementX: clientX - state.x,
			movementY: clientY - state.y,
			targetX: clientX - (state.targetRect?.left ?? 0),
			targetY: clientY - (state.targetRect?.top ?? 0),
			x: clientX,
			y: clientY,
		};

		props.onDragMove?.({ ...state });
	}

	function handleDragEnd(event: PointerEvent) {
		event.preventDefault();
		globalThis.window.removeEventListener("pointermove", handleDragMove);
		globalThis.window.removeEventListener("pointerup", handleDragEnd);
		globalThis.window.removeEventListener("pointercancel", handleDragEnd);

		const { clientX, clientY } = event;

		state = {
			...state,
			displacementX: clientX - state.startX,
			displacementY: clientY - state.startY,
			duration: event.timeStamp - state.startTime,
			isDragging: false,
			movementX: clientX - state.x,
			movementY: clientY - state.y,
			targetX: clientX - (state.targetRect?.left ?? 0),
			targetY: clientY - (state.targetRect?.top ?? 0),
			timeStamp: event.timeStamp,
			x: clientX,
			y: clientY,
		};

		props.onDragEnd?.({ ...state });
	}

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		event,
	) => {
		event.preventDefault();

		if (state.isDragging) return;

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

		state = {
			timeStamp,
			targetRect,
			targetStartX,
			targetStartY,
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
			targetX: targetStartX,
			targetY: targetStartY,
			x: clientX,
			y: clientY,
		};

		props.onDragStart?.({ ...state });
	};

	return { onPointerDown } as const;
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

export interface PointerDragState {
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
}

export type PointerDragStartHandler = (state: PointerDragState) => void;

export type PointerDragMoveHandler = (state: PointerDragState) => void;

export type PointerDragEndHandler = (state: PointerDragState) => void;

export interface UsePointerDragProps {
	onDragStart?: PointerDragStartHandler;
	onDragMove?: PointerDragMoveHandler;
	onDragEnd?: PointerDragEndHandler;
}
