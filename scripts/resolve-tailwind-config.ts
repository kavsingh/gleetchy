import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../tailwind.config.js";

export default function resolveTailwindConfig() {
	return resolveConfig(tailwindConfig);
}

export type ResolvedTailwindConfig = ReturnType<typeof resolveTailwindConfig>;
