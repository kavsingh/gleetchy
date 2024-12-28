import containerQueriesPlugin from "@tailwindcss/container-queries";

import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				surface0: "oklch(var(--color-surface0) / <alpha-value>)",
				text100: "oklch(var(--color-text100) / <alpha-value>)",
				text400: "oklch(var(--color-text400) / <alpha-value>)",
				text600: "oklch(var(--color-text600) / <alpha-value>)",
				semanticError: "oklch(var(--color-semanticError) / <alpha-value>)",
				semanticFocus: "oklch(var(--color-semanticFocus) / <alpha-value>)",
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
