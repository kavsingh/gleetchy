import styled from "@emotion/styled";

import Button from "./button";

import type { ReactElement } from "react";
import type { ButtonProps } from "./button";

const ButtonSet = styled.div<{
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

export default ButtonSet;
