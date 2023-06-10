import { describe, it, expect } from "vitest";

import { filterSupportedEvents } from "./env";

// Note: this suite assumes window object as provided by jest / jsdom

describe("lib/env", () => {
	describe("filterSupportedEvents", () => {
		it("filters passed in strings for supported event names", () => {
			expect(
				filterSupportedEvents([
					"mousedown",
					"onmousedown",
					"onmouseup",
					"onmouseup",
					"zigzam",
					"onzigzam",
				]),
			).toStrictEqual(["mousedown", "mouseup"]);
		});
	});
});
