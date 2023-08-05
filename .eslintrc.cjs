/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: [require.resolve("./packages/codestyle-js/.eslintrc.cjs")],
};
