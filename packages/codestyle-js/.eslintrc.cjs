/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	reportUnusedDisableDirectives: true,
	env: { es2022: true, node: true, browser: false },
	parser: "@typescript-eslint/parser",
	parserOptions: { project: "./tsconfig.json" },
	settings: {
		"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
		"import/resolver": {
			"eslint-import-resolver-typescript": { project: "./tsconfig.json" },
		},
	},
	plugins: ["filenames", "deprecation"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:prettier/recommended",
	],
	rules: {
		"camelcase": "off",
		"curly": ["warn", "multi-line", "consistent"],
		"no-console": "off",
		"no-restricted-syntax": [
			"warn",
			{ selector: "TSEnumDeclaration", message: "Avoid using enums" },
		],
		"no-unreachable": "error",
		"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ disallowTypeAnnotations: false },
		],
		"@typescript-eslint/member-ordering": ["warn"],
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": [
			"error",
			{
				ignoreTypeValueShadow: false,
				ignoreFunctionTypeParameterNameValueShadow: true,
			},
		],
		"no-throw-literal": "off",
		"@typescript-eslint/no-throw-literal": "error",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],
		"filenames/match-regex": ["error", "^[a-z0-9-.]+$", true],
		"filenames/match-exported": ["error", "kebab"],
		"import/no-cycle": "error",
		"import/no-self-import": "error",
		"import/no-unused-modules": "error",
		"import/no-useless-path-segments": "error",
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
				"pathGroupsExcludedImportTypes": ["type"],
				"alphabetize": { order: "asc" },
				"newlines-between": "always",
			},
		],
		"deprecation/deprecation": "warn",
		"prettier/prettier": "warn",
	},
	overrides: [
		{
			files: ["*.c[jt]s?(x)"],
			parserOptions: { sourceType: "script" },
			rules: { "@typescript-eslint/no-var-requires": "off" },
		},
		{
			files: ["*.?(c)js?(x)"],
			extends: ["plugin:@typescript-eslint/disable-type-checked"],
			rules: {
				"deprecation/deprecation": "off",
			},
		},
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
	],
};
