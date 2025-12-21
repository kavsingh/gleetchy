import { ErrorBoundary } from "solid-js";

import { UI } from "#ui";

import { AppStoreProvider } from "./app-store/context";
import { ErrorMessage } from "./components/error-message";

import type { AppStore } from "#app-store/create";

export function App(props: { store: AppStore }) {
	return (
		<AppStoreProvider store={props.store}>
			<ErrorBoundary
				fallback={(err) => <ErrorMessage>{String(err)}</ErrorMessage>}
			>
				<UI />
			</ErrorBoundary>
		</AppStoreProvider>
	);
}
