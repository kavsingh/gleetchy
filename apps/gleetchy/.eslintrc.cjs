/** @type {import("path")} */
const path = require("path");

/** @type {import("typescript")} */
const ts = require("typescript");

const tsconfigFile = ts.findConfigFile(
	__dirname,
	ts.sys.fileExists,
	"tsconfig.json",
);
const tsconfig = tsconfigFile
	? ts.readConfigFile(tsconfigFile, ts.sys.readFile)
	: undefined;

const tsconfigPathPatterns = Object.keys(
	tsconfig?.config?.compilerOptions?.paths ?? {},
);
const testFileSuffixes = ["test", "spec", "mock"];

function testFilePatterns({ root = "", extensions = "*" } = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: [require.resolve("@gleetchy/codestyle-js/.eslintrc.cjs")],
	parserOptions: { tsconfigRootDir: __dirname },
	settings: {
		"import/resolver": {
			"eslint-import-resolver-typescript": {
				project: "apps/gleetchy/tsconfig.json",
			},
		},
	},
	rules: {
		"import/order": [
			"warn",
			{
				"groups": [
					"builtin",
					"external",
					"internal",
					["parent", "sibling", "index"],
					"type",
				],
				"pathGroups": [
					...tsconfigPathPatterns.map((pattern) => ({
						pattern,
						group: "internal",
					})),
				],
				"pathGroupsExcludedImportTypes": ["type"],
				"alphabetize": { order: "asc" },
				"newlines-between": "always",
			},
		],
	},
	overrides: [
		{
			files: ["src/**/*"],
			env: { node: false, browser: true },
			settings: {
				tailwindcss: { callees: ["twMerge", "twJoin"] },
			},
			extends: ["plugin:tailwindcss/recommended", "plugin:solid/typescript"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			extends: [
				"plugin:vitest/all",
				"plugin:testing-library/dom",
				"plugin:jest-dom/recommended",
			],
			rules: {
				"no-console": "off",
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				"vitest/no-hooks": "off",
			},
		},
		{
			files: testFilePatterns({ extensions: "ts?(x)" }),
			rules: {
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
	],
};
