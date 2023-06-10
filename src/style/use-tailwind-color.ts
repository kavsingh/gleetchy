import { useMemo } from "react";

import { extractCssVar } from "~/lib/css";

import useUITheme from "./use-ui-theme";

export default function useTailwindColor(
	selector: (config: typeof TAILWIND_COLORS) => unknown,
): string | undefined {
	const { theme } = useUITheme();

	return useMemo(() => {
		const value = selector(TAILWIND_COLORS);
		const cssVar = extractCssVar(String(value));

		if (!cssVar) return;

		return THEME_COLOR_VARS?.[theme]?.[cssVar];
	}, [selector, theme]);
}
