import { createEffect, onCleanup } from "solid-js";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default function ThemeEffects() {
	const theme = useAppSelector(selectTheme);
	const doc = globalThis.document.documentElement;

	function handleChange() {
		if (theme() === "system") {
			doc.classList.toggle("dark", darkSchemeQuery?.matches);
		}
	}

	createEffect(() => {
		if (theme() !== "system") {
			doc.classList.toggle("dark", theme() === "dark");
		}
	});

	darkSchemeQuery?.addEventListener("change", handleChange);
	handleChange();

	onCleanup(() => {
		darkSchemeQuery?.removeEventListener("change", handleChange);
	});

	return null;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const darkSchemeQuery = (globalThis.matchMedia?.(
	"(prefers-color-scheme: dark)",
) ?? undefined) as MediaQueryList | undefined;
