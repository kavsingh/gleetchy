import { createContext, useContext } from "solid-js";

import type { AppStore } from "./create";
import type { ParentProps } from "solid-js";

export function AppStoreProvider(props: ParentProps<{ store: AppStore }>) {
	return (
		// eslint-disable-next-line solid/reactivity
		<AppStoreContext.Provider value={props.store}>
			{props.children}
		</AppStoreContext.Provider>
	);
}

export function useAppStore() {
	const store = useContext(AppStoreContext);

	if (!store) {
		throw new Error("useAppStore must be used within AppStoreProvider");
	}

	return store;
}

const AppStoreContext = createContext<AppStore | undefined>(undefined);
