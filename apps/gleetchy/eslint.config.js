import tailwindcss from "eslint-plugin-better-tailwindcss";
import {
	getDefaultAttributes,
	getDefaultCallees,
	getDefaultVariables,
} from "eslint-plugin-better-tailwindcss/api/defaults";
import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "eslint/config";
import { configs as tsEslint } from "typescript-eslint";

// TODO: use eslint plugins via oxlint jsPlugin once available in language server

export default defineConfig(
	{
		ignores: [
			"dist/*",
			"reports/*",
			"**/__generated__/*",
			"!**/__generated__/__mocks__/",
		],
	},

	{
		languageOptions: { parserOptions: { projectService: true } },
		linterOptions: { reportUnusedDisableDirectives: true },
	},

	{
		extends: [tsEslint.base],
		files: ["src/**/*.ts?(x)"],
	},

	{
		extends: [
			// @ts-expect-error upstream types
			solid.configs["flat/recommended"],
			// @ts-expect-error upstream types
			tailwindcss.configs.recommended,
		],
		files: ["src/**/*.tsx"],
		rules: {
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/enforce-consistent-important-position": "error",
			"better-tailwindcss/enforce-shorthand-classes": "error",
		},
		settings: {
			"better-tailwindcss": {
				entryPoint: "src/index.css",
				callees: [...getDefaultCallees(), "tj", "tm"],
				variables: [
					...getDefaultVariables(),
					[".+ClassName", [{ match: "strings" }]],
					[".+ClassNames", [{ match: "strings" }, { match: "objectValues" }]],
				],
				attributes: [
					...getDefaultAttributes(),
					["classNames", [{ match: "strings" }, { match: "objectValues" }]],
					[".+ClassNames", [{ match: "strings" }, { match: "objectValues" }]],
				],
			},
		},
	},

	{
		extends: [
			testingLibrary.configs["flat/dom"],
			jestDom.configs["flat/recommended"],
		],
		files: ["src/**/*.test.ts?(x)"],
	},
);
