/// <reference types="vitest" />

import path from "path";

import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import checkerPlugin from "vite-plugin-checker";
import importsPlugin from "vite-plugin-imp";

const checker = checkerPlugin({
	overlay: { initialIsOpen: false },
	typescript: true,
	eslint: {
		lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
		dev: { logLevel: ["error"] },
	},
});

const imports = importsPlugin({
	libList: [
		{ libName: "lodash", libDirectory: "", camel2DashComponentName: false },
	],
});

export default defineConfig(({ mode }) => ({
	define: { "import.meta.vitest": "undefined" },
	build: { sourcemap: true },
	plugins: [imports, reactPlugin(), checker],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
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
