import { memo, StrictMode } from "react";
import { Provider } from "react-redux";

import UI from "~/ui";

import StyledContainer from "./style/styled-container";
import ErrorBoundary from "./components/error-boundary";

import type { AppStore } from "~/app-store/configure-store";

export default memo(function App({ store }: { store: AppStore }) {
	return (
		<StrictMode>
			<Provider store={store}>
				<StyledContainer>
					<ErrorBoundary>
						<UI />
					</ErrorBoundary>
				</StyledContainer>
			</Provider>
		</StrictMode>
	);
});
