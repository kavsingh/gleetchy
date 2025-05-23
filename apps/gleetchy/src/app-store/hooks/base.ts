import { createSignal, onCleanup } from "solid-js";

import { useAppStore } from "../context";

import type { AppState } from "../create";
import type { MemoOptions } from "solid-js";

export { useAppStore };

export function useAppSelector<T>(
	selector: (state: AppState) => T,
	equals?: MemoOptions<T>["equals"],
) {
	const store = useAppStore();
	const [selected, setSelected] = createSignal<T>(
		selector(store.getState()),
		equals ? { equals } : undefined,
	);
	const unsubscribe = store.subscribe(() => {
		setSelected(() => selector(store.getState()));
	});

	onCleanup(unsubscribe);

	return selected;
}

export function useAppDispatch() {
	const store = useAppStore();

	return store.dispatch;
}
