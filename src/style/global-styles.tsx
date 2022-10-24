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
		font-size: 14px;
		cursor: default;
		user-select: none;
	}

	*,
	*::before,
	*::after {
		box-sizing: inherit;
		cursor: inherit;
		user-select: inherit;
	}

	/* resets */
	*:focus,
	*:active {
		outline: none;
	}

	*:focus-visible {
		outline: 1px solid ${theme.colors.semantic.focus};
	}

	button {
		margin: 0;
		padding: 0;
		border: none;
		outline: none;
		font: inherit;
		line-height: inherit;
		color: currentcolor;
		background: none;
		cursor: pointer;
	}

	button:disabled {
		cursor: default;
	}

	html,
	body {
		inline-size: 100%;
		margin: 0;
		padding: 0;
		background-color: ${theme.colors.surface[0]};
		-webkit-font-smoothing: antialiased;
	}

	/* TODO: move this back to UI root when audio engine refactored */
	body {
		color: ${theme.colors.text[400]};
		font-family: ${theme.fonts.body};
	}
`;
