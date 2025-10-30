import path from "node:path";
import { fileURLToPath } from "node:url";

import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultCallees } from "eslint-plugin-better-tailwindcss/api/defaults";
import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";

import baseConfig from "../../eslint.config.js";
import { testFilePatterns, testFileSuffixes } from "../../eslint.helpers.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
	...baseConfig,

	{
		ignores: [
			"src-tauri/*",
			"dist/*",
			"dist-isolation/*",
			"coverage/*",
			"**/__generated__/*",
			"!**/__generated__/__mocks__/",
		],
	},

	{
		settings: {
			"import-x/resolver": {
				"eslint-import-resolver-typescript": {
					project: path.resolve(dirname, "tsconfig.json"),
				},
			},
		},
	},

	{
		files: ["src/**/*.?(m|c)[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
		settings: {
			"better-tailwindcss": {
				entryPoint: "src/index.css",
				callees: [...getDefaultCallees(), "tj", "tm"],
			},
		},
		extends: [
			// @ts-expect-error upstream types
			solid.configs["flat/recommended"],
		],
		plugins: {
			// @ts-expect-error upstream types
			"better-tailwindcss": tailwindcss,
		},
		rules: {
			"no-console": "error",
			"@typescript-eslint/no-restricted-imports": [
				"error",
				{
					paths: [
						{
							name: "tailwind-merge",
							message: "please import helpers from #style",
						},
					],
				},
			],
			...tailwindcss.configs["recommended"]?.rules,
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/enforce-shorthand-classes": "warn",
			"better-tailwindcss/no-conflicting-classes": "error",
		},
	},

	{
		files: testFilePatterns(),
		languageOptions: {
			globals: { ...globals.node },
		},
		rules: {
			"no-console": "off",
			"filenames/match-exported": [
				"error",
				{
					transforms: ["kebab"],
					remove: `\\.(${testFileSuffixes.join("|")})$`,
				},
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/unbound-method": "off",
		},
	},

	{
		files: testFilePatterns({ root: "src" }),
		languageOptions: {
			globals: { ...globals.node, ...globals.browser },
		},
		settings: {
			vitest: { typecheck: true },
		},
		extends: [
			vitest.configs.all,
			testingLibrary.configs["flat/dom"],
			jestDom.configs["flat/recommended"],
		],
		rules: {
			"vitest/no-hooks": "off",
		},
	},
);
