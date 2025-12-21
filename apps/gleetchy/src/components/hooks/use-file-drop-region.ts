import { createSignal } from "solid-js";

import type { JSX } from "solid-js";

function cancelEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();
}

export function useFileDropRegion(props: UseFileDropRegionProps) {
	const [isDropActive, setIsDropActive] = createSignal(false);

	const eventSetDropActive: DragEventHandler = (event) => {
		cancelEvent(event);
		setIsDropActive(true);
	};

	const eventSetDropInactive: DragEventHandler = (event) => {
		cancelEvent(event);
		setIsDropActive(false);
	};

	const onDrop: DragEventHandler = (event) => {
		cancelEvent(event);
		setIsDropActive(false);

		if (!props.onFiles) return;

		props.onFiles(
			// oxlint-disable-next-line prefer-spread FileList has no symbol.iterator
			Array.from(event.dataTransfer?.files ?? []).filter((...args) => {
				return props.fileFilter ? props.fileFilter(...args) : true;
			}),
		);
	};

	const eventHandlers = {
		onDrop,
		onDrag: cancelEvent,
		onDragOver: cancelEvent,
		onDragStart: cancelEvent,
		onDragEnter: eventSetDropActive,
		onDragLeave: eventSetDropInactive,
		onDragEnd: eventSetDropInactive,
	};

	return { isDropActive, eventHandlers } as const;
}

export interface UseFileDropRegionProps {
	fileFilter?(file: File, index: number, files: File[]): boolean;
	onFiles?(files: File[]): unknown;
}

type DragEventHandler = JSX.EventHandlerUnion<HTMLElement, DragEvent>;
