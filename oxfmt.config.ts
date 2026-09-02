import { defineConfig } from "oxfmt";

import type { OxfmtConfig } from "oxfmt";

const config: OxfmtConfig = defineConfig({
	ignorePatterns: [
		"*.lock",
		"**/.nx/**/*",
		"**/dist/**/*",
		"**/reports/**/*",
		"**/*.gen.*",
	],
	printWidth: 80,
	useTabs: true,
	sortImports: {
		order: "asc",
		groups: [
			["builtin"],
			["external"],
			["internal", "subpath"],
			["parent"],
			["sibling", "index"],
			["type"],
		],
	},
	overrides: [
		{ files: ["**/*.{json,jsonc}"], options: { trailingComma: "none" } },
	],
});

export default config;
