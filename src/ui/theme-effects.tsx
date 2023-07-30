import { memo, useEffect } from "react";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default memo(function ThemeEffects() {
	const theme = useAppSelector(selectTheme);

	useEffect(() => {
		const doc = globalThis.document.documentElement;

		if (theme !== "system") {
			doc.classList.toggle("dark", theme === "dark");

			return;
		}

		function handleChange() {
			doc.classList.toggle("dark", darkSchemeQuery?.matches);
		}

		darkSchemeQuery?.addEventListener("change", handleChange);

		handleChange();

		return function cleanup() {
			darkSchemeQuery?.removeEventListener("change", handleChange);
		};
	}, [theme]);

	return null;
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const darkSchemeQuery = (globalThis.matchMedia?.(
	"(prefers-color-scheme: dark)",
) ?? undefined) as MediaQueryList | undefined;
