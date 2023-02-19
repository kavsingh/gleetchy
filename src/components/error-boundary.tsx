import { PureComponent } from "react";

import ErrorMessage from "~/components/error-message";

import type { ReactNode } from "react";

const defaultRenderError: ErrorRenderer = (error) => (
	<ErrorMessage>{error.toString()}</ErrorMessage>
);

class ErrorBoundary extends PureComponent<
	{ silent?: boolean; renderError?: ErrorRenderer; children: ReactNode },
	State
> {
	public override state: State = {};

	static getDerivedStateFromError(error: Error): State {
		return { error };
	}

	public override render(): ReactNode {
		const {
			children = null,
			silent = false,
			renderError = defaultRenderError,
		} = this.props;
		const { error } = this.state;

		return error && !silent ? renderError(error) : <>{children}</>;
	}
}

export default ErrorBoundary;

export type ErrorRenderer = <E extends Error>(error: E) => ReactNode;

type State = { error?: Error };
