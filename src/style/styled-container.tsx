import { ThemeProvider } from "@emotion/react";

import useUITheme from "~/style/use-ui-theme";

import type { PropsWithChildren } from "react";

export default function StyledContainer({ children }: PropsWithChildren) {
	const { theme } = useUITheme();

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
