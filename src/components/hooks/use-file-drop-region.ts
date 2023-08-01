import { createSignal } from "solid-js";

import { cancelReactEvent } from "~/lib/util";

import type { JSX } from "solid-js";

type DragEventHandler = JSX.EventHandlerUnion<HTMLElement, DragEvent>;

export default function useFileDropRegion(props: UseFileDropRegionProps) {
	const [isDropActive, setIsDropActive] = createSignal(false);

	const eventSetDropActive: DragEventHandler = (event) => {
		event.preventDefault();
		setIsDropActive(true);
	};

	const eventSetDropInactive: DragEventHandler = (event) => {
		event.preventDefault();
		setIsDropActive(false);
	};

	const onDrop: DragEventHandler = (event) => {
		event.preventDefault();
		setIsDropActive(false);

		if (!props.onFiles) return;

		props.onFiles(
			Array.from(event.dataTransfer?.files ?? []).filter((...args) => {
				return props.fileFilter ? props.fileFilter(...args) : true;
			}),
		);
	};

	const eventHandlers = {
		onDrop,
		onDrag: cancelReactEvent,
		onDragOver: cancelReactEvent,
		onDragStart: cancelReactEvent,
		onDragEnter: eventSetDropActive,
		onDragLeave: eventSetDropInactive,
		onDragEnd: eventSetDropInactive,
	};

	return { isDropActive, eventHandlers } as const;
}

export type UseFileDropRegionProps = {
	fileFilter?(file: File, index: number, files: File[]): boolean;
	onFiles?(files: File[]): unknown;
};
