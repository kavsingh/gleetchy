import path from "node:path";

import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import {
	SelectorKind,
	MatcherType,
} from "eslint-plugin-better-tailwindcss/types";
import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

import base from "../../oxlint.config.ts";

export default defineConfig({
	extends: [base],
	env: { node: true, browser: false },
	ignorePatterns: [
		"dist/**/*",
		"dist-isolation/**/*",
		"reports/**/*",
		"**/__generated__/**/*",
		"!**/__generated__/__mocks__/**/*",
	],
	settings: {
		"jsx-a11y": {
			components: { Button: "button" },
			attributes: { for: ["for"] },
		},
		"better-tailwindcss": {
			cwd: import.meta.dirname,
			entryPoint: path.resolve(import.meta.dirname, "./src/index.css"),
			selectors: [
				...getDefaultSelectors(),
				...["tj", "tm"].map((name) => ({
					name,
					kind: SelectorKind.Callee,
					match: [{ type: MatcherType.String }],
				})),
				...["classNames", ".+ClassNames"].map((name) => ({
					name,
					kind: SelectorKind.Attribute,
					match: [
						{ type: MatcherType.String },
						{ type: MatcherType.ObjectValue },
					],
				})),
				...[".+ClassName", ".+ClassNames"].map((name) => ({
					name,
					kind: SelectorKind.Variable,
					match: [
						{ type: MatcherType.String },
						{ type: MatcherType.ObjectValue },
					],
				})),
			],
		},
		vitest: { typecheck: true },
	},
	rules: {
		"typescript/strict-void-return": "off",
		"import/no-relative-parent-imports": "off",
	},
	overrides: [
		{
			files: ["src/**/*"],
			env: { browser: true, node: false },
			jsPlugins: ["eslint-plugin-solid", "eslint-plugin-better-tailwindcss"],
			rules: {
				"eslint/no-console": "error",
				"eslint/no-restricted-imports": [
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

				"import/no-nodejs-modules": "error",

				...solid.configs["flat/typescript"].rules,

				...tailwindcss.configs["recommended-error"].rules,
				"better-tailwindcss/enforce-consistent-line-wrapping": "off",
				"better-tailwindcss/enforce-consistent-variant-order": "error",
				"better-tailwindcss/enforce-logical-properties": "error",
			},
		},
		{
			files: ["src/**/*.tsx"],
			plugins: ["jsx-a11y"],
			rules: {
				"eslint/max-lines-per-function": "off",
				"eslint/max-statements": "off",
			},
		},
		{
			files: ["**/*.test.{ts,tsx}"],
			env: { browser: true, node: true },
			plugins: ["vitest"],
			rules: {
				"eslint/max-lines-per-function": "off",
				"eslint/max-statements": "off",
				"eslint/no-console": "off",
				"import/no-namespace": "off",
				"unicorn/consistent-function-scoping": "off",
				"vitest/no-conditional-in-test": "off",
				"vitest/no-importing-vitest-globals": "off",
				"vitest/prefer-to-be-falsy": "off",
				"vitest/prefer-to-be-truthy": "off",
				"vitest/require-test-timeout": "off",
			},
		},
		{
			files: ["src/**/*.test.tsx"],
			jsPlugins: ["eslint-plugin-jest-dom", "eslint-plugin-testing-library"],
			// @ts-expect-error upstream types
			rules: {
				...jestDom.configs["flat/recommended"].rules,
				...testingLibrary.configs["flat/dom"].rules,
			},
		},
	],
});
