import path from "node:path";

import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import {
	getDefaultAttributes,
	getDefaultCallees,
} from "eslint-plugin-better-tailwindcss/api/defaults";
import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";

import baseConfig from "../../eslint.config.js";

// TODO: use eslint plugins via oxlint jsPlugin once available in language server

export default defineConfig(
	...baseConfig,

	{
		ignores: [
			"dist/*",
			"dist-isolation/*",
			"reports/*",
			"**/__generated__/*",
			"!**/__generated__/__mocks__/",
		],
	},

	{
		settings: {
			"import-x/resolver": {
				"eslint-import-resolver-typescript": {
					project: path.resolve(import.meta.dirname, "tsconfig.json"),
				},
			},
		},
	},

	{
		extends: [
			// @ts-expect-error upstream types
			solid.configs["flat/recommended"],
		],
		files: ["src/**/*.?(m|c)[tj]s?(x)"],
		plugins: { "better-tailwindcss": tailwindcss },
		rules: {
			...tailwindcss.configs["recommended"]?.rules,
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/no-conflicting-classes": "error",
		},
		settings: {
			"better-tailwindcss": {
				callees: [...getDefaultCallees(), "tj", "tm"],
				attributes: [
					...getDefaultAttributes(),
					"class",
					["classList", { match: "string" }],
					["classList", { match: "objectKeys" }],
				],
				entryPoint: "src/index.css",
			},
		},
	},

	{
		extends: [
			testingLibrary.configs["flat/dom"],
			jestDom.configs["flat/recommended"],
		],
		files: ["src/**/*.test.?(m|c)[tj]s?(x)"],
	},
);
