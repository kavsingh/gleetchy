import { ThemeProvider } from "@emotion/react";

import useUITheme from "~/app-store/hooks/use-ui-theme";

import type { FC, ReactNode } from "react";

const StyledContainer: FC<{ children: ReactNode }> = ({ children }) => {
	const { theme } = useUITheme();

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default StyledContainer;
