/// <reference types="vitest" />

import { defineConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { Plugin } from "vite";

export default defineConfig(({ mode }) => ({
	build: { sourcemap: true },
	plugins: [tsconfigPathsPlugin(), solidPlugin(), checker(mode)] as (
		| Plugin
		| undefined
	)[],
	test: {
		include: ["./src/**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		clearMocks: true,
		server: { deps: { inline: [/solid-js/] } },
		deps: { optimizer: { web: { include: ["solid-js"] } } },
	},
}));

function checker(mode: string) {
	if (mode !== "development") return undefined;

	return checkerPlugin({
		overlay: { initialIsOpen: false },
		typescript: true,
		eslint: {
			lintCommand: 'eslint "./src/**/*.+(ts|tsx)"',
			dev: { logLevel: ["error"] },
		},
	});
}
