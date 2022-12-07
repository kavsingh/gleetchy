import { memo } from "react";
import { css, Global, useTheme } from "@emotion/react";

import type { FC } from "react";
import type { Theme } from "@emotion/react";

const GlobalStyles: FC = () => {
	const theme = useTheme();

	return <Global styles={globalStyles(theme)} />;
};

export default memo(GlobalStyles);

const globalStyles = (theme: Theme) => css`
	html {
		box-sizing: border-box;
		font: 14px/1.2 ${theme.fonts.body};
		cursor: default;
		user-select: none;
		color: ${theme.colors.text[400]};
		background-color: ${theme.colors.surface[0]};
	}

	*,
	*::before,
	*::after {
		box-sizing: inherit;
		cursor: inherit;
		user-select: inherit;
	}

	*:focus,
	*:active {
		outline: none;
	}

	*:focus-visible {
		outline: 1px solid ${theme.colors.semantic.focus};
	}

	body {
		inline-size: 100%;
		margin: 0;
		padding: 0;
		-webkit-font-smoothing: antialiased;
	}
`;
