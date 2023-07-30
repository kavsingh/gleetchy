export function cancelEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();

	return false;
}

export function cancelReactEvent<T extends { nativeEvent: Event }>(event: T) {
	return cancelEvent(event.nativeEvent);
}
