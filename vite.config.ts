/// <reference types="vitest" />

import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import checkerPlugin from "vite-plugin-checker";
import importsPlugin from "vite-plugin-imp";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import resolveTailwindConfig from "./scripts/resolve-tailwind-config";

// const checker = checkerPlugin({
// 	overlay: { initialIsOpen: false },
// 	typescript: true,
// 	eslint: {
// 		lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
// 		dev: { logLevel: ["error"] },
// 	},
// });

const imports = importsPlugin({
	libList: [
		{ libName: "lodash", libDirectory: "", camel2DashComponentName: false },
	],
});

export default defineConfig(({ mode }) => ({
	define: {
		"import.meta.vitest": "undefined",
		"TAILWIND_CONFIG": JSON.stringify(resolveTailwindConfig()),
	},
	build: { sourcemap: true },
	plugins: [tsconfigPathsPlugin(), imports, reactPlugin()],
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
