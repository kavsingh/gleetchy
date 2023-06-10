import { useMemo } from "react";

import { extractCssVar } from "~/lib/css";

import useUITheme from "./use-ui-theme";

export default function useTailwindValue(
	selector: (config: (typeof TAILWIND_CONFIG)["theme"]) => unknown,
): string | undefined {
	const { theme } = useUITheme();

	return useMemo(() => {
		const value = selector(TAILWIND_CONFIG.theme);
		const cssVar = extractCssVar(String(value));

		if (!cssVar) return;

		return THEME_CSS_VARS[theme]?.[cssVar];
	}, [selector, theme]);
}
