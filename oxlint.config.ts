import { defineConfig } from "oxlint";

export default defineConfig({
	ignorePatterns: [".vscode/**/*", "**/.nx/**/*"],
	plugins: ["oxc", "eslint", "typescript", "promise", "import", "unicorn"],
	categories: {
		correctness: "error",
		suspicious: "error",
		pedantic: "error",
		restriction: "error",
		perf: "error",
		style: "error",
		nursery: "error",
	},
	env: { node: true },
	rules: {
		"oxc/no-async-await": "off",
		"oxc/no-optional-chaining": "off",
		"oxc/no-rest-spread-properties": "off",

		"eslint/arrow-body-style": "off",
		"eslint/capitalized-comments": "off",
		"eslint/curly": ["error", "multi-line", "consistent"],
		"eslint/eqeqeq": "error",
		"eslint/id-length": "off",
		"eslint/func-style": [
			"error",
			"declaration",
			{ allowTypeAnnotation: true },
		],
		"eslint/max-classes-per-file": "off",
		"eslint/max-lines-per-function": [
			"error",
			{ skipBlankLines: true, skipComments: true },
		],
		"eslint/no-continue": "off",
		"eslint/no-duplicate-imports": [
			"error",
			{ allowSeparateTypeImports: true },
		],
		"eslint/no-inline-comments": ["error", { ignorePattern: "@type" }],
		"eslint/no-magic-numbers": "off",
		"eslint/no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
		"eslint/no-ternary": "off",
		"eslint/no-undef": "off",
		"eslint/no-undefined": "off",
		"eslint/no-use-before-define": "off",
		"eslint/no-void": ["error", { allowAsStatement: true }],
		"eslint/no-warning-comments": ["error", { terms: ["fixme", "revert"] }],
		"eslint/prefer-destructuring": "off",
		"eslint/sort-imports": "off",
		"eslint/sort-keys": "off",

		"typescript/consistent-type-imports": [
			"error",
			{ fixStyle: "separate-type-imports", prefer: "type-imports" },
		],
		"typescript/explicit-function-return-type": "off",
		"typescript/explicit-module-boundary-types": "off",
		"typescript/no-non-null-assertion": "error",
		"typescript/prefer-readonly": "off",
		"typescript/prefer-readonly-parameter-types": "off",
		"typescript/promise-function-async": "off",
		"typescript/restrict-template-expressions": [
			"error",
			{ allowNumber: true },
		],
		"typescript/strict-boolean-expressions": "off",

		"import/group-exports": "off",
		"import/exports-last": "off",
		"import/max-dependencies": "off",
		"import/no-cycle": "error",
		"import/no-default-export": "error",
		"import/no-named-export": "off",
		"import/no-nodejs-modules": "off",
		"import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
		"import/prefer-default-export": "off",

		"unicorn/catch-error-name": ["error", { name: "cause" }],
		"unicorn/no-array-reduce": "off",
		"unicorn/no-useless-undefined": "off",
	},
	overrides: [
		{
			files: ["**/typings/*.d.ts"],
			rules: {
				"import/unambiguous": "off",
			},
		},
		{
			files: ["*.config.{js,ts}"],
			rules: {
				"import/no-default-export": "off",
				"import/no-anonymous-default-export": "off",
			},
		},
	],
});
