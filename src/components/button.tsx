import styled from "@emotion/styled";

import type { FC } from "react";

const Button: FC<ButtonProps> = ({ handler, children }) => (
	<Container
		role="button"
		tabIndex={0}
		onClick={handler}
		onKeyDown={(event) => {
			if (event.key === "Enter") handler();
		}}
	>
		[ {children} ]
	</Container>
);

export default Button;

const Container = styled.div`
	font-size: 0.8rem;
	cursor: pointer;
	transition: color 0.2s ease-out;

	&:hover,
	&:active {
		color: ${({ theme }) => theme.colors.text[600]};
	}
`;

export interface ButtonProps {
	handler: () => unknown;
	children: string | string[];
}
