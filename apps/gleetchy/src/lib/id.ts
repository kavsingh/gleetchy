import { slug } from "cuid";

export const prefixedId = (prefix: string) => `${prefix}-${slug()}`;

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
