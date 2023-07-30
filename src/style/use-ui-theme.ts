import { useCallback, useEffect } from "react";

import { usePreferredColorScheme } from "~/apis/color-scheme";
import { useAppDispatch, useAppSelector } from "~/app-store/hooks/base";
import {
	setDarkTheme,
	setLightTheme,
	toggleTheme as toggleThemeAction,
} from "~/app-store/ui/actions";
import { selectTheme } from "~/app-store/ui/selectors";

export default function useUITheme() {
	const dispatch = useAppDispatch();
	const theme = useAppSelector(selectTheme);
	const preferredColorScheme = usePreferredColorScheme();

	const toggleTheme = useCallback(
		() => dispatch(toggleThemeAction()),
		[dispatch],
	);

	useEffect(() => {
		switch (preferredColorScheme) {
			case "dark":
				dispatch(setDarkTheme());
				break;
			case "light":
				dispatch(setLightTheme());
				break;
			default:
				break;
		}
	}, [dispatch, preferredColorScheme]);

	return { theme, toggleTheme } as const;
}
