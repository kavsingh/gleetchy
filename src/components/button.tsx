import styled from "@emotion/styled";

import type { ComponentProps, FC } from "react";

const Button: FC<ComponentProps<typeof Container>> = ({
	children,
	...props
}) => (
	<Container tabIndex={0} {...props}>
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
