import path from "node:path";
import { fileURLToPath } from "node:url";

import jestDom from "eslint-plugin-jest-dom";
import solid from "eslint-plugin-solid";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config.js";
import { testFilePatterns, testFileSuffixes } from "../../eslint.helpers.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslint.config(
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
		extends: [solid.configs["flat/recommended"]],
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
