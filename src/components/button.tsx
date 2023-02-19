import { css } from "@emotion/react";
import styled from "@emotion/styled";

const Button = styled.button<{ variant?: Variant }>`
	margin: 0;
	padding: 0;
	border: none;
	font: inherit;
	color: currentcolor;
	background: none;
	cursor: pointer;
	transition: color 0.2s ease-out;
	font-size: ${({ variant = "braced" }) =>
		variant === "braced" ? "0.8rem" : "inherit"};

	&:disabled {
		cursor: default;
		color: ${({ theme }) => theme.colors.text[100]};
	}

	&:not(:disabled):hover,
	&:not(:disabled):active,
	&:not(:disabled):focus-visible {
		color: ${({ theme }) => theme.colors.text[600]};
	}

	${({ variant = "braced" }) =>
		variant === "braced"
			? css`
					&::before,
					&::after {
						display: inline;
					}

					&::before {
						content: "[ ";
					}

					&::after {
						content: " ]";
					}
			  `
			: ""}
`;

export default Button;

export type Variant = "braced" | "text";
