import styled from "@emotion/styled";

import type { ComponentProps, FC } from "react";

const Button: FC<ComponentProps<typeof Container>> = ({
	size = "small",
	children,
	...props
}) => (
	<Container tabIndex={0} size={size} {...props}>
		[ {children} ]
	</Container>
);

export default Button;

const Container = styled.button<{ size?: ButtonSize }>`
	font-size: ${({ size = "small" }) =>
		size === "small" ? "0.8rem" : "inherit"};
	cursor: pointer;
	transition: color 0.2s ease-out;

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

export type ButtonSize = "small" | "inherit";
