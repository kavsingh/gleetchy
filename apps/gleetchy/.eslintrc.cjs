/** @type {import("path")} */
const path = require("path");

const baseConfig = require("@gleetchy/codestyle-js/.eslintrc.cjs");
const vitest = require("eslint-plugin-vitest");
/** @type {import("eslint").ESLint.ConfigData} */
/** @type {import("typescript")} */
const ts = require("typescript");

const testFileSuffixes = ["test", "spec", "mock"];

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: [require.resolve("@gleetchy/codestyle-js/.eslintrc.cjs")],
	parserOptions: { tsconfigRootDir: __dirname },
	settings: {
		"import/resolver": {
			"eslint-import-resolver-typescript": {
				project: path.join(__dirname, "tsconfig.json"),
			},
		},
	},
	rules: {
		"import/order": getImportOrderConfig(),
	},
	overrides: [
		{
			files: ["src/**/*"],
			env: { node: false, browser: true },
			settings: {
				tailwindcss: {
					callees: ["twMerge", "twJoin"],
					config: path.join(__dirname, "tailwind.config.ts"),
				},
			},
			extends: ["plugin:tailwindcss/recommended", "plugin:solid/typescript"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: getTestFilePatterns(),
			env: { node: true },
			plugins: ["vitest"],
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
			rules: {
				"no-console": "off",
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/unbound-method": "off",
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				// @ts-expect-error type import mismatch
				...vitest.configs.all.rules,
				"vitest/no-hooks": "off",
			},
		},
	],
};

function getTestFilePatterns({ root = "", extensions = "*" } = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}

/** @returns {import("eslint").Linter.RuleEntry} */
function getImportOrderConfig() {
	const baseImportOrder = baseConfig.rules?.["import/order"];
	const [severity, config] = Array.isArray(baseImportOrder)
		? baseImportOrder
		: [];

	const tsconfigPathPatterns = Object.keys(
		getTsConfig()?.config?.compilerOptions?.paths ?? {},
	);

	return [
		severity ?? "warn",
		{
			...config,
			pathGroups: [
				...(config?.pathGroups ?? []),
				...tsconfigPathPatterns.map((pattern) => ({
					pattern,
					group: "internal",
				})),
			],
		},
	];
}

function getTsConfig() {
	const tsconfigFile = ts.findConfigFile(
		__dirname,
		ts.sys.fileExists,
		"tsconfig.json",
	);

	return tsconfigFile
		? ts.readConfigFile(tsconfigFile, ts.sys.readFile)
		: undefined;
}
