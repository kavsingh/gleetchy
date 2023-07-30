import { describe, it, expect } from "vitest";

import { filterSupportedEvents } from "./env";

describe("lib/env", () => {
	describe("filterSupportedEvents", () => {
		// assumes document events as provided by jsdom
		it("should filter passed in strings for supported event names", () => {
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
