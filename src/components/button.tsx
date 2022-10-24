import styled from "@emotion/styled";

import type { FC } from "react";

const Button: FC<ButtonProps> = ({ handler, children }) => (
	<Container tabIndex={0} onClick={handler}>
		[ {children} ]
	</Container>
);

export default Button;

const Container = styled.button`
	border: none;
	background: none;
	font: inherit;
	font-size: 0.8rem;
	color: currentcolor;
	cursor: pointer;
	transition: color 0.2s ease-out;
	margin: 0;
	padding: 0;
	appearance: none;

	&:disabled {
		cursor: default;
		color: ${({ theme }) => theme.colors.text[100]};
	}

	&:not(:disabled):hover,
	&:not(:disabled):active,
	&:not(:disabled):focus-visible {
		color: ${({ theme }) => theme.colors.text[600]};
	}
`;

export interface ButtonProps {
	handler: () => unknown;
	children: string | string[];
}
