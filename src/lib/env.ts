import { uniq } from "ramda";

const asEventName = (name: string) =>
	name.startsWith("on") ? name.slice(2) : name;

const isSupportedEvent = (name: string) => {
	const asHandlerName = name.startsWith("on") ? name : `on${name}`;

	return globalThis.document
		? asHandlerName in globalThis.document ||
				asHandlerName in globalThis.document.documentElement
		: false;
};

export const filterSupportedEvents = (eventNames: string[]) =>
	uniq(
		eventNames.reduce((acc: string[], name) => {
			if (isSupportedEvent(name)) acc.push(asEventName(name));
			return acc;
		}, []),
	);
