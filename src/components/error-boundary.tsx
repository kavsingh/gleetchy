import { PureComponent } from "react";

import ErrorMessage from "~/components/error-message";

import type { ReactNode } from "react";

class ErrorBoundary extends PureComponent<
	{ silent?: boolean; renderError?: ErrorRenderer; children: ReactNode },
	State
> {
	public state: State = {};

	public componentDidCatch(error: Error): void {
		this.setState(() => ({ error }));
	}

	public render(): ReactNode {
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

const defaultRenderError: ErrorRenderer = (error) => (
	<ErrorMessage>{error.toString()}</ErrorMessage>
);

export type ErrorRenderer = <E extends Error>(error: E) => ReactNode;

interface State {
	error?: Error;
}
