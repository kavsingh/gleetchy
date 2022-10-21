/// <reference types="vitest" />

import path from "path";

import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import legacyPlugin from "@vitejs/plugin-legacy";
import checkerPlugin from "vite-plugin-checker";
import impPlugin from "vite-plugin-imp";

const checker = checkerPlugin({
	overlay: { initialIsOpen: false },
	typescript: true,
	eslint: {
		lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
		dev: { logLevel: ["error"] },
	},
});

const imp = impPlugin({
	libList: [
		{ libName: "lodash", libDirectory: "", camel2DashComponentName: false },
	],
});

export default defineConfig(({ command }) => ({
	define: { "import.meta.vitest": "undefined" },
	build: { sourcemap: true },
	plugins: [
		imp,
		reactPlugin(),
		command === "serve" && checker,
		command === "build" && legacyPlugin(),
	],
	resolve: {
		alias: {
			"react": "preact/compat",
			"react-dom": "preact/compat",
			"~": path.resolve(__dirname, "./src"),
		},
	},
	css: { modules: { localsConvention: "camelCaseOnly" } },
	esbuild: {
		jsxFactory: "jsx",
		jsxInject: "import { jsx } from '@emotion/react'",
	},
	test: {
		include: ["src/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		coverage: { reporter: ["text", "html"] },
		includeSource: ["src/**/*.{js,ts}"],
	},
}));
