/// <reference types="vitest" />

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
	define: { "import.meta.vitest": "undefined" },
	build: { sourcemap: true },
	plugins: [tsconfigPathsPlugin(), reactPlugin(), checker(mode)],
	resolve: {
		alias: {
			...(mode !== "test"
				? {
						"react": "preact/compat",
						"react-dom": "preact/compat",
				  }
				: {}),
		},
	},
	css: { modules: { localsConvention: "camelCaseOnly" } },
	test: {
		include: ["src/**/*.{test,spec}.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		coverage: { reporter: ["text", "html"] },
		includeSource: ["src/**/*.{ts,tsx,js,jsx}"],
	},
}));

function checker(mode: string) {
	if (mode !== "development") return;

	return checkerPlugin({
		overlay: { initialIsOpen: false },
		typescript: true,
		eslint: {
			lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
			dev: { logLevel: ["error"] },
		},
	});
}
