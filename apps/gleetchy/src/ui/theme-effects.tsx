import { createEffect, onCleanup } from "solid-js";

import { ui } from "#stores/ui";

const doc = globalThis.document.documentElement;
const darkSchemeQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

export default function ThemeEffects() {
	function handleQueryChange() {
		if (ui.theme !== "system") return;

		doc.classList.toggle("dark", darkSchemeQuery.matches);
	}

	createEffect(() => {
		doc.classList.toggle(
			"dark",
			ui.theme === "system" ? darkSchemeQuery.matches : ui.theme === "dark",
		);
	});

	darkSchemeQuery.addEventListener("change", handleQueryChange);
	handleQueryChange();

	onCleanup(() => {
		darkSchemeQuery.removeEventListener("change", handleQueryChange);
	});

	return null;
}
