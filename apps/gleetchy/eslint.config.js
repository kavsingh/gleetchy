import path from "node:path";

import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultCallees } from "eslint-plugin-better-tailwindcss/api/defaults";
import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";

import baseConfig from "../../eslint.config.js";

const { dirname } = import.meta;

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
					project: path.resolve(dirname, "tsconfig.json"),
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
			"@typescript-eslint/no-restricted-imports": [
				"error",
				{
					paths: [
						{
							message: "please import helpers from #style",
							name: "tailwind-merge",
						},
					],
				},
			],
			...tailwindcss.configs["recommended"]?.rules,
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/enforce-shorthand-classes": "warn",
			"better-tailwindcss/no-conflicting-classes": "error",
		},
		settings: {
			"better-tailwindcss": {
				callees: [...getDefaultCallees(), "tj", "tm"],
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
