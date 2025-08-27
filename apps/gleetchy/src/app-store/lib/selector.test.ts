import { createSelector } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";

import { createDeepEqualSelector } from "./selector";

describe("custom state selectors", () => {
	// Check assumptions for default createSelector
	describe("default createSelector assumptions check", () => {
		it("results in new value on ref changes despite equal values", () => {
			expect.assertions(3);

			let state = { a: { b: [1, 2] } };
			const aSelector = (s: typeof state) => s.a;

			const bSelector = createSelector(aSelector, (a) => a.b);
			const b = bSelector(state);

			expect(b).toStrictEqual([1, 2]);

			state = { a: { b: [1, 2] } };

			expect(bSelector(state)).not.toBe(b);
			expect(bSelector(state)).toStrictEqual(b);
		});
	});

	describe(createDeepEqualSelector, () => {
		it("only results in new value if state value has changed", () => {
			expect.assertions(3);

			let state = { a: { b: [1, 2] } };
			const aSelector = (s: typeof state) => s.a;

			const bSelector = createDeepEqualSelector(aSelector, (a) => a.b);
			const b = bSelector(state);

			expect(b).toStrictEqual([1, 2]);

			state = { a: { b: [1, 2] } };

			expect(bSelector(state)).toBe(b);

			state = { a: { b: [2, 1] } };

			expect(bSelector(state)).not.toBe(b);
		});
	});
});
