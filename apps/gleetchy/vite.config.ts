import tailwindcssPlugin from "@tailwindcss/vite";
import { defineConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { Plugin } from "vite";

export default defineConfig(({ mode }) => ({
	build: { sourcemap: true },
	plugins: [
		tsconfigPathsPlugin(),
		solidPlugin() as unknown as Plugin,
		tailwindcssPlugin() as unknown as Plugin,
		checker(mode),
	],
}));

function checker(mode: string) {
	if (mode !== "development") return undefined;

	return checkerPlugin({
		overlay: { initialIsOpen: false },
		typescript: true,
		eslint: {
			useFlatConfig: true,
			lintCommand: 'eslint "./src"',
			dev: { logLevel: ["error"] },
		},
	});
}
