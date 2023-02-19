import { useEffect } from "react";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectThemeName } from "~/app-store/ui/selectors";

export default function useApplyThemeClass() {
	const themeName = useAppSelector(selectThemeName);

	useEffect(() => {
		const root = globalThis.document.documentElement;

		root.classList.toggle("dark", themeName === "dark");
		root.classList.toggle("ligh", themeName === "light");
	}, [themeName]);
}
