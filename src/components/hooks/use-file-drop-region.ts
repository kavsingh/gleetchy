import { useState, useCallback, useMemo } from "react";
import { stubTrue, noop } from "lodash";

import { cancelReactEvent } from "~/lib/util";

import type { DragEventHandler } from "react";

export interface UseFileDropRegionProps {
	fileFilter?(file: File, index: number, array: File[]): boolean;
	onFiles?(files: File[]): unknown;
	onNoFiles?(): unknown;
}

export default function useFileDropRegion({
	fileFilter = stubTrue,
	onFiles = noop,
	onNoFiles = noop,
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
			const receivable = Array.from(event.dataTransfer.files).filter(
				fileFilter,
			);

			cancelReactEvent(event);
			setIsDropActive(false);

			if (receivable.length) onFiles(receivable);
			else onNoFiles();
		},
		[fileFilter, onFiles, onNoFiles],
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
