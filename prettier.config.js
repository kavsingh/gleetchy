/** @type {import('prettier').Config} */
export default {
	quoteProps: "consistent",
	useTabs: true,
	// https://github.com/prettier/prettier/issues/15956#issuecomment-3000347490
	overrides: [{ files: ["**/*.jsonc"], options: { trailingComma: "none" } }],
};
