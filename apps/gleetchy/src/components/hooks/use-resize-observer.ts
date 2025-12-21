const elementCallbacks = new WeakMap<Element, UseResizeObserverEntryCallback>();

const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		elementCallbacks.get(entry.target)?.(entry);
	}
});

export function useResizeObserver() {
	function observe(
		el: Element,
		onResize: UseResizeObserverEntryCallback,
	): UseResizeObserverUnobserveFn {
		elementCallbacks.set(el, onResize);
		resizeObserver.observe(el);

		return function unobserve() {
			resizeObserver.unobserve(el);
			elementCallbacks.delete(el);
		};
	}

	return observe;
}

export type UseResizeObserverEntryCallback = (
	entry: ResizeObserverEntry,
) => void;

export type UseResizeObserverUnobserveFn = () => void;
