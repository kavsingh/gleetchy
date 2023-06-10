import { useState, useCallback, useEffect } from "react";

export function getPreferredColorScheme(): ColorSchemePreference {
	if (darkSchemeQuery?.matches) return "dark";

	if (lightSchemeQuery?.matches) return "light";

	return "no-preference";
}

export function usePreferredColorScheme() {
	const [scheme, setScheme] = useState(getPreferredColorScheme());

	const handleDarkSchemeQueryChange = useCallback(
		(event: MediaQueryListEvent) => {
			if (event.matches) setScheme("dark");
		},
		[],
	);

	const handleLightSchemeQueryChange = useCallback(
		(event: MediaQueryListEvent) => {
			if (event.matches) setScheme("light");
		},
		[],
	);

	useEffect(() => {
		darkSchemeQuery?.addEventListener("change", handleDarkSchemeQueryChange);
		lightSchemeQuery?.addEventListener("change", handleLightSchemeQueryChange);

		return () => {
			darkSchemeQuery?.removeEventListener(
				"change",
				handleDarkSchemeQueryChange,
			);
			lightSchemeQuery?.removeEventListener(
				"change",
				handleLightSchemeQueryChange,
			);
		};
	}, [handleDarkSchemeQueryChange, handleLightSchemeQueryChange]);

	return scheme;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const darkSchemeQuery = (globalThis.matchMedia?.(
	"(prefers-color-scheme: dark)",
) ?? undefined) as MediaQueryList | undefined;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const lightSchemeQuery = (globalThis.matchMedia?.(
	"(prefers-color-scheme: light)",
) ?? undefined) as MediaQueryList | undefined;

export type ColorSchemePreference = "no-preference" | "light" | "dark";
