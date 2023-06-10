import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ErrorBoundary from "./error-boundary";

import type { ErrorRenderer } from "./error-boundary";

describe("ErrorBoundary", () => {
	it.only("should render child contents if no error", () => {
		render(
			<ErrorBoundary>
				<Success />,
			</ErrorBoundary>,
		);

		expect(screen.getByText("Success")).toBeInTheDocument();
	});

	it("should render error message by default if child throws error", () => {
		render(
			<ErrorBoundary>
				<WithError />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Render Error")).toBeInTheDocument();
	});

	it("should render fallback if child throws error", () => {
		render(
			<ErrorBoundary renderError={fallbackErrorRenderer}>
				<WithError />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Fallback Render Error")).toBeInTheDocument();
	});
});

function Success() {
	return <div>Success</div>;
}

function WithError() {
	throw new Error("Render Error");

	return null;
}

const fallbackErrorRenderer: ErrorRenderer = (err) => (
	<div>Fallback {err.toString()}</div>
);
