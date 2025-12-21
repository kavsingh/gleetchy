import { describe, it, expect } from "vitest";

import { stableWithout, stableFilter, stableAppendUnique } from "./array";

describe("util/array", () => {
	describe(stableWithout, () => {
		it("returns same array if nothing to remove", () => {
			expect.assertions(2);

			const initialArray = [1, 2, 3];
			const result = stableWithout([5, 6], initialArray);

			expect(result).toStrictEqual([1, 2, 3]);
			expect(result).toBe(initialArray);
		});

		it("returns new array if items to remove", () => {
			expect.assertions(2);

			const initialArray = [1, 2, 3, 3];
			const result = stableWithout([1, 3, "q"], initialArray);

			expect(result).toStrictEqual([2]);
			expect(result).not.toBe(initialArray);
		});
	});

	describe(stableFilter, () => {
		it("returns same array if nothing to remove", () => {
			expect.assertions(2);

			const initialArray = [1, 2, 3];
			const result = stableFilter((item) => item !== 5, initialArray);

			expect(result).toStrictEqual([1, 2, 3]);
			expect(result).toBe(initialArray);
		});

		it("returns new array if items to remove", () => {
			expect.assertions(2);

			const initialArray = [1, 2, 3, 3];
			const result = stableFilter(
				(item) => item !== 3 && item !== 1,
				initialArray,
			);

			expect(result).toStrictEqual([2]);
			expect(result).not.toBe(initialArray);
		});
	});

	describe(stableAppendUnique, () => {
		it("does nothing if item is already unique and last in array", () => {
			expect.assertions(2);

			const initialArray = [1, 2, 3];
			const result = stableAppendUnique([2, 3], initialArray);

			expect(result).toStrictEqual([1, 2, 3]);
			expect(result).toBe(initialArray);
		});

		it("removes others and returns new array if item is last but not unique", () => {
			expect.assertions(2);

			const initialArray = [1, 3, 2, 3];
			const result = stableAppendUnique([3], initialArray);

			expect(result).toStrictEqual([1, 2, 3]);
			expect(result).not.toBe(initialArray);
		});

		it("removes other instances and appends to end of new array", () => {
			expect.assertions(2);

			const initialArray = [2, 1, 2, 3];
			const appendItems = stableAppendUnique.bind(undefined, [2, 1, "c"]);
			const result = appendItems(initialArray);

			expect(result).toStrictEqual([3, 2, 1, "c"]);
			expect(result).not.toBe(initialArray);
		});
	});
});
