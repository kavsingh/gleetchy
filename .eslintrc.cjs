/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: [require.resolve("./packages/codestyle-js/.eslintrc.cjs")],
	parserOptions: { project: "./tsconfig.json" },
	settings: {
		"import-x/resolver": {
			"eslint-import-resolver-typescript": { project: "./tsconfig.json" },
		},
	},
};
