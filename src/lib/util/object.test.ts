import { describe, it, expect } from "vitest";

import { isNotNil, stableOmit } from "./object";

describe("util/Object", () => {
	describe("isNotNil", () => {
		it("determines if value is not nil", () => {
			expect(isNotNil(undefined)).toBe(false);
			expect(isNotNil(null)).toBe(false);
			expect(isNotNil(0)).toBe(true);
			expect(isNotNil({})).toBe(true);
			expect(isNotNil([])).toBe(true);
			expect(isNotNil(NaN)).toBe(true);
		});
	});

	describe("stableOmit", () => {
		it("returns same object if nothing to remove", () => {
			const initialObject: {
				a: number;
				b: number;
				c: number;
				d?: never;
				e?: never;
			} = { a: 1, b: 2, c: 3 };
			const result = stableOmit(["d", "e"], initialObject);

			expect(result).toEqual({ a: 1, b: 2, c: 3 });
			expect(result).toBe(initialObject);
		});

		it("returns new object if items to remove", () => {
			const initialObject = { a: 1, b: 2, c: 3 };
			const omitKeys = stableOmit(["a", "c"]);
			const result = omitKeys(initialObject);

			expect(result).toEqual({ b: 2 });
			expect(result).not.toBe(initialObject);
		});
	});
});
