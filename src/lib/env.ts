export function filterSupportedEvents(eventNames: string[]) {
	const supported = new Set<string>();

	for (const eventName of eventNames) {
		if (isSupportedEvent(eventName)) supported.add(asEventName(eventName));
	}

	return Array.from(supported);
}

function asEventName(name: string) {
	return name.startsWith("on") ? name.slice(2) : name;
}

function isSupportedEvent(name: string) {
	const asHandlerName = name.startsWith("on") ? name : `on${name}`;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return globalThis.document
		? asHandlerName in globalThis.document ||
				asHandlerName in globalThis.document.documentElement
		: false;
}
