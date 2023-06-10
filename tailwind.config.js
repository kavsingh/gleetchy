/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				surface0: "var(--color-surface0)",
				text100: "var(--color-text100)",
				text400: "var(--color-text400)",
				text600: "var(--color-text600)",
				semanticError: "var(--color-semanticError)",
				semanticFocus: "var(--color-semanticFocus)",
			},
			animation: {
				appear: "fade-in 400ms ease-out forwards",
			},
			keyframes: {
				"fade-in": {
					to: { opacity: 1 },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/container-queries"),
		// @ts-expect-error untyped
		require("tailwindcss-logical"),
	],
};
