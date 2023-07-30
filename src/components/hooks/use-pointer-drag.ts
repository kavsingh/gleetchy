import rafThrottle from "raf-throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterSupportedEvents } from "~/lib/env";
import { cancelEvent } from "~/lib/util";

import type { MouseEventHandler, TouchEventHandler } from "react";

const usePointerDrag = ({
	onDragStart,
	onDragMove,
	onDragEnd,
}: UsePointerDragProps) => {
	const stateRef = useRef(initialState);
	const [eventNames, setEventNames] = useState<{
		moveEvents: string[];
		endEvents: string[];
	}>({ moveEvents: [], endEvents: [] });
	const { moveEvents, endEvents } = eventNames;

	const handleDragMove = useCallback(
		(event: Event) => {
			const { clientX, clientY, timeStamp } = cancelAndNormalizeEvent(event);

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

	const throttledHandleDragMove = useMemo(
		() => rafThrottle(handleDragMove),
		[handleDragMove],
	);

	const handleDragEnd = useCallback(
		(event: Event) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!globalThis.window) return;

			const { clientX, clientY } = cancelAndNormalizeEvent(event);

			moveEvents.forEach((eventName) => {
				globalThis.window.removeEventListener(
					eventName,
					throttledHandleDragMove,
				);
			});

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
		[moveEvents, onDragEnd, throttledHandleDragMove],
	);

	const registerDragStart = useCallback(
		(normalisedEvent: NormalizedEvent) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!globalThis.window || stateRef.current.isDragging) return;

			const { currentTarget, clientX, clientY, timeStamp } = normalisedEvent;
			const targetRect = currentTarget.getBoundingClientRect();
			const targetStartX = clientX - targetRect.top;
			const targetStartY = clientY - targetRect.left;

			moveEvents.forEach((eventName) => {
				globalThis.window.addEventListener(eventName, throttledHandleDragMove, {
					passive: false,
				});
			});

			endEvents.forEach((eventName) => {
				globalThis.window.addEventListener(eventName, handleDragEnd, {
					passive: false,
					once: true,
				});
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
		[
			moveEvents,
			endEvents,
			onDragStart,
			throttledHandleDragMove,
			handleDragEnd,
		],
	);

	const onMouseDown = useCallback<MouseEventHandler<HTMLElement>>(
		(event) => {
			registerDragStart(normalizeEvent(event));
		},
		[registerDragStart],
	);

	const onTouchStart = useCallback<TouchEventHandler<HTMLElement>>(
		(event) => {
			registerDragStart(normalizeEvent(event));
		},
		[registerDragStart],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mouseMoveEvents = filterSupportedEvents(["mousemove"]);
		const mouseEndEvents = filterSupportedEvents(["mouseup"]);
		const touchMoveEvents = filterSupportedEvents(["touchmove"]);
		const touchEndEvents = filterSupportedEvents(["touchend", "touchcancel"]);

		setEventNames({
			moveEvents: [...mouseMoveEvents, ...touchMoveEvents],
			endEvents: [...mouseEndEvents, ...touchEndEvents],
		});
	}, []);

	return { onMouseDown, onTouchStart } as const;
};

export default usePointerDrag;

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
	// TODO: check if can drop ClientRect
	// eslint-disable-next-line deprecation/deprecation
	targetRect: ClientRect | DOMRect | null;
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

const normalizeEvent = (event: MouseOrTouchEvent): NormalizedEvent => {
	const { currentTarget, timeStamp } = event;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const { clientX = 0, clientY = 0 } = (event as TouchEvent).touches
		? (event as TouchEvent).touches[0] ?? {}
		: (event as MouseEvent);

	return {
		clientX,
		clientY,
		timeStamp,
		currentTarget: currentTarget as HTMLElement,
	};
};

const cancelAndNormalizeEvent = (event: Event) => {
	cancelEvent(event);

	return normalizeEvent(event);
};

type MouseOrTouchEvent =
	| Event
	| MouseEvent
	| TouchEvent
	| React.MouseEvent
	| React.TouchEvent;

type NormalizedEvent = {
	currentTarget: HTMLElement;
	clientX: number;
	clientY: number;
	timeStamp: number;
};
