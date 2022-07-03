import { memo } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const animation = keyframes`
  to {
    opacity: 1;
  }
`;

const AnimIn = styled.div`
	inline-size: 100%;
	block-size: 100%;
	opacity: 0;
	animation: ${animation} 400ms forwards ease-out;
`;

export default memo(AnimIn);
