import { memo, useEffect } from "react";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default memo(function ThemeEffects() {
	const theme = useAppSelector(selectTheme);

	useEffect(() => {
		const root = globalThis.document.documentElement;

		root.classList.toggle("dark", theme === "dark");
		root.classList.toggle("light", theme === "light");
	}, [theme]);

	return null;
});
