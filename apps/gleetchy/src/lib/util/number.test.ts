import { describe, it, expect } from "vitest";

import { clamp, denormalize, normalize } from "./number";

describe("number utils", () => {
	describe(clamp, () => {
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
			// oxlint-disable-next-line max-params
			(value, min, max, expected) => {
				expect.assertions(1);
				expect(clamp(min, max, value)).toBe(expected);
			},
		);
	});

	describe(normalize, () => {
		it.each([
			// [value, min, max, expected]
			[5, 0, 10, 0.5],
			[5, 6, 10, -0.25],
			[-5, -6, -4, 0.5],
			[8, 0, 4, 2],
			[-8, -4, 0, -1],
		])(
			"should normalize %s from range %s - %s, returning %s",
			// oxlint-disable-next-line max-params
			(value, min, max, expected) => {
				expect.assertions(1);
				expect(normalize(min, max, value)).toBe(expected);
			},
		);
	});

	describe(denormalize, () => {
		it.each([
			// [value, min, max, expected]
			[0.5, 0, 10, 5],
			[-0.25, 6, 10, 5],
			[0.5, -6, -4, -5],
			[2, 0, 4, 8],
			[-1, -4, 0, -8],
		])(
			"should denormalize %s from range %s - %s, returning %s",
			// oxlint-disable-next-line max-params
			(value, min, max, expected) => {
				expect.assertions(1);
				expect(denormalize(min, max, value)).toBe(expected);
			},
		);
	});
});
