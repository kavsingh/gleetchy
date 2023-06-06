import { useEffect } from "react";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default function useApplyThemeClass() {
	const themeName = useAppSelector(selectTheme);

	useEffect(() => {
		const root = globalThis.document.documentElement;

		root.classList.toggle("dark", themeName === "dark");
		root.classList.toggle("light", themeName === "light");
	}, [themeName]);
}
