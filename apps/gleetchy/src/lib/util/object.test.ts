import { describe, it, expect } from "vitest";

import { stableOmit } from "./object";

describe("util/Object", () => {
	describe(stableOmit, () => {
		it("returns same object if nothing to remove", () => {
			expect.assertions(2);

			const initialObject: {
				a: number;
				b: number;
				c: number;
				d?: never;
				e?: never;
			} = { a: 1, b: 2, c: 3 };
			const result = stableOmit(["d", "e"], initialObject);

			expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
			expect(result).toBe(initialObject);
		});

		it("returns new object if items to remove", () => {
			expect.assertions(2);

			const initialObject = { a: 1, b: 2, c: 3 };
			const result = stableOmit(["a", "c"], initialObject);

			expect(result).toStrictEqual({ b: 2 });
			expect(result).not.toBe(initialObject);
		});
	});
});
