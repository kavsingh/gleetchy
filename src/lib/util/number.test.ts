import { describe, it, expect } from "vitest";

import { clamp } from "./number";

describe("number utils", () => {
	describe("clamp", () => {
		it.each([
			// [value, min, max, expected]
			[5, 0, 10, 5],
			[5, 6, 10, 6],
			[-3, -6, -4, -4],
			[-8, -6, 0, -6],
			[-4, -6, -4, -4],
			[5, -10, -5, -5],
			[10, -5, 5, 5],
			// incorrect min-max order
			[5, 10, 0, 10],
			[20, 10, 0, 0],
		])(
			"should clamp %s within %s - %s inclusive, returning %s",
			(value, min, max, expected) => {
				expect(clamp(value, min, max)).toBe(expected);
			},
		);
	});
});
