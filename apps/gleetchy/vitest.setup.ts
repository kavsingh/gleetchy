import "web-audio-test-api";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "solid-testing-library";
import { afterEach, expect } from "vitest";

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Vi {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
		interface JestAssertion<T = any> extends ExtendedJestMatchers<T> {}
	}
}

type ExtendedJestMatchers<T> = jest.Matchers<void, T> &
	TestingLibraryMatchers<T, void>;
