import { stubTrue, noop } from "lodash";
import { useState, useCallback, useMemo } from "react";

import { cancelReactEvent } from "~/lib/util";

import type { DragEventHandler } from "react";

export default function useFileDropRegion({
	fileFilter = stubTrue,
	onFiles = noop,
}: UseFileDropRegionProps): {
	isDropActive: boolean;
	eventHandlers: {
		onDrop: DragEventHandler;
		onDrag: typeof cancelReactEvent;
		onDragOver: typeof cancelReactEvent;
		onDragStart: typeof cancelReactEvent;
		onDragEnter: DragEventHandler;
		onDragLeave: DragEventHandler;
		onDragEnd: DragEventHandler;
	};
} {
	const [isDropActive, setIsDropActive] = useState(false);

	const eventSetDropActive = useCallback<DragEventHandler>((event) => {
		cancelReactEvent(event);
		setIsDropActive(true);
	}, []);

	const eventSetDropInactive = useCallback<DragEventHandler>((event) => {
		cancelReactEvent(event);
		setIsDropActive(false);
	}, []);

	const onDrop = useCallback<DragEventHandler>(
		(event) => {
			const filtered = Array.from(event.dataTransfer.files).filter(fileFilter);

			cancelReactEvent(event);
			setIsDropActive(false);
			onFiles(filtered);
		},
		[fileFilter, onFiles],
	);

	const eventHandlers = useMemo(
		() => ({
			onDrop,
			onDrag: cancelReactEvent,
			onDragOver: cancelReactEvent,
			onDragStart: cancelReactEvent,
			onDragEnter: eventSetDropActive,
			onDragLeave: eventSetDropInactive,
			onDragEnd: eventSetDropInactive,
		}),
		[onDrop, eventSetDropActive, eventSetDropInactive],
	);

	return { isDropActive, eventHandlers };
}

export type UseFileDropRegionProps = {
	fileFilter?(file: File, index: number, files: File[]): boolean;
	onFiles?(files: File[]): unknown;
};
