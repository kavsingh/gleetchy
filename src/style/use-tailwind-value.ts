import { useMemo } from "react";

import { usePreferredColorScheme } from "~/apis/color-scheme";
import { resolveCssTokenValue } from "~/lib/css";

export default function useTailwindValue(
	selector: (config: (typeof TAILWIND_CONFIG)["theme"]) => unknown,
): string | undefined {
	const preferredScheme = usePreferredColorScheme();

	return useMemo(
		() => {
			const value = selector(TAILWIND_CONFIG.theme);

			if (!value) return;

			return resolveCssTokenValue(String(value));
		},
		// force re-evaluation if color scheme changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[preferredScheme],
	);
}
