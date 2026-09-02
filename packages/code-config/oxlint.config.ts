import { defineConfig } from "oxlint";

import { baseConfig } from "./oxlint.ts";

import type { OxlintConfig } from "oxlint";

const config: OxlintConfig = defineConfig({
	extends: [baseConfig],
});

export default config;
