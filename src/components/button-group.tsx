import styled from "@emotion/styled";

import Button from "./button";

import type { ComponentProps, ReactElement } from "react";

const ButtonGroup = styled.div<{
	children: ReactElement<ButtonProps>[] | ReactElement<ButtonProps>;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 100%;
	min-block-size: 5em;
	padding: 0.8rem 0;
`;

export { Button };

export default ButtonGroup;

type ButtonProps = ComponentProps<typeof Button>;
