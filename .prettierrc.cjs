/** @type {import('prettier').Config} */
module.exports = {
	quoteProps: 'consistent',
	useTabs: true,
	plugins: [require("prettier-plugin-tailwindcss")],
}
