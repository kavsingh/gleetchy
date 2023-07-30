import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../tailwind.config";

export default function resolveTailwindConfig() {
	return resolveConfig(tailwindConfig);
}

export type ResolvedTailwindConfig = ReturnType<typeof resolveTailwindConfig>;
