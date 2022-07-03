import { describe, it, expect } from "vitest";

import { requireWindowWith, filterSupportedEvents } from "./env";

// Note: this suite assumes window object as provided by jest / jsdom

describe("lib/env", () => {
	describe("requireWindowWith", () => {
		it("returns the window object only if all path specs exist", () => {
			expect(
				requireWindowWith([
					"document.createElement",
					"document.addEventListener",
				]),
			).toBe(window);

			expect(
				requireWindowWith(["document.createElement", "zigZamWam"]),
			).toBeUndefined();
		});
	});

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
			).toEqual(["mousedown", "mouseup"]);
		});
	});
});
