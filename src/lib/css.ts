import { twMerge } from "tailwind-merge";
import classNames from "classnames";

// tailwind-merge around classname api
export function tcx(...args: Parameters<typeof classNames>) {
	return twMerge(classNames(...args));
}

export function resolveCssTokenValue(token: string, el?: HTMLElement) {
	const cleaned = token.startsWith("var(")
		? token.replace(/^var\(/, "").replace(/\)$/, "")
		: token;

	if (!cleaned.startsWith("--")) return token;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return globalThis.document.documentElement
		? getComputedStyle(el ?? globalThis.document.documentElement)
				.getPropertyValue(cleaned)
				.trim()
		: "";
}
