import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "./vite.config";

export default mergeConfig(
	baseConfig({ command: "build", mode: "production" }),
	defineConfig({
		resolve: { conditions: ["development", "browser"] },
		test: {
			include: ["src/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
			includeSource: ["src/**/*.?(m|c)[tj]s?(x)"],
			environment: "jsdom",
			setupFiles: ["./vitest.setup.ts"],
			clearMocks: true,
			coverage: {
				include: [
					"src",
					"!**/__generated__",
					"!**/__mocks__",
					"!**/__test*__",
					"!**/*.{test,spec}.*",
				],
			},
		},
	}),
);
