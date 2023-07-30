import { useState, useEffect } from "react";

export function getPreferredColorScheme(): ColorSchemePreference {
	if (darkSchemeQuery?.matches) return "dark";

	if (lightSchemeQuery?.matches) return "light";

	return "system";
}

export function usePreferredColorScheme() {
	const [scheme, setScheme] = useState(getPreferredColorScheme());

	useEffect(() => {
		function handleQueryChange() {
			setScheme(getPreferredColorScheme());
		}

		darkSchemeQuery?.addEventListener("change", handleQueryChange);
		lightSchemeQuery?.addEventListener("change", handleQueryChange);

		return function cleanup() {
			darkSchemeQuery?.removeEventListener("change", handleQueryChange);
			lightSchemeQuery?.removeEventListener("change", handleQueryChange);
		};
	}, []);

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

export type ColorSchemePreference = "system" | "light" | "dark";
