import containerQueriesPlugin from "@tailwindcss/container-queries";

import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				surface0: "rgb(var(--color-surface0) / <alpha-value>)",
				text100: "rgb(var(--color-text100) / <alpha-value>)",
				text400: "rgb(var(--color-text400) / <alpha-value>)",
				text600: "rgb(var(--color-text600) / <alpha-value>)",
				semanticError: "rgb(var(--color-semanticError) / <alpha-value>)",
				semanticFocus: "rgb(var(--color-semanticFocus) / <alpha-value>)",
			},
			animation: {
				appear: "fade-in 400ms ease-out forwards",
			},
			keyframes: {
				"fade-in": {
					to: { opacity: "1" },
				},
			},
		},
	},
	plugins: [containerQueriesPlugin],
};

export default config;
