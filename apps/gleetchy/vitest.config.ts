import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import baseAppConfig from "./vite.config.ts";

import type { ViteUserConfig } from "vitest/config";

export default defineConfig((configEnv) => {
	return {
		test: {
			clearMocks: true,
			expect: { requireAssertions: true },
			coverage: { provider: "v8", reportsDirectory: "./reports/coverage" },
			projects: [
				mergeConfig(
					baseAppConfig(configEnv),
					defineProject({
						resolve: { conditions: ["development", "browser"] },
						test: {
							name: "app",
							include: ["src/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
							environment: "jsdom",
							setupFiles: ["./src/vitest.setup.ts"],
							server: { deps: { inline: true } },
						},
					}),
				),
			],
		},
	} satisfies ViteUserConfig;
});
