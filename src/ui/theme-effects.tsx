import { createEffect, onCleanup } from "solid-js";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default function ThemeEffects() {
	const theme = useAppSelector(selectTheme);
	const doc = globalThis.document.documentElement;

	function handleQueryChange() {
		if (theme() !== "system") return;

		doc.classList.toggle("dark", darkSchemeQuery?.matches);
	}

	createEffect(() => {
		const themeValue = theme();

		doc.classList.toggle(
			"dark",
			themeValue === "system"
				? darkSchemeQuery?.matches
				: themeValue === "dark",
		);
	});

	darkSchemeQuery?.addEventListener("change", handleQueryChange);
	handleQueryChange();

	onCleanup(() => {
		darkSchemeQuery?.removeEventListener("change", handleQueryChange);
	});

	return null;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const darkSchemeQuery = (globalThis.matchMedia?.(
	"(prefers-color-scheme: dark)",
) ?? undefined) as MediaQueryList | undefined;
