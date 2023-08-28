import "@testing-library/jest-dom/vitest";
import "web-audio-test-api";
import { cleanup } from "solid-testing-library";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});
