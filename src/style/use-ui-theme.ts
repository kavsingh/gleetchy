import { useCallback, useEffect } from "react";

import { usePreferredColorScheme } from "~/apis/color-scheme";
import { selectTheme } from "~/app-store/ui/selectors";
import {
	setDarkTheme,
	setLightTheme,
	toggleTheme as toggleThemeAction,
} from "~/app-store/ui/actions";
import { useAppDispatch, useAppSelector } from "~/app-store/hooks/base";

import useApplyThemeClass from "./use-apply-theme-class";

const useUITheme = () => {
	useApplyThemeClass();
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
};

export default useUITheme;
