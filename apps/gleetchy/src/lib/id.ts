import { nanoid } from "nanoid/non-secure";

export function prefixedId(prefix: string) {
	return `${prefix}-${nanoid(10)}`;
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest;

	describe("lib/id", () => {
		describe("prefixedId", () => {
			it("generates a uuid with given prefix", () => {
				expect(prefixedId("prefix")).toMatch(/^prefix-/);
			});
		});
	});
}
