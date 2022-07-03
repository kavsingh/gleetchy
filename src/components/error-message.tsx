import styled from "@emotion/styled";

const ErrorMessage = styled.div`
	inline-size: 100%;
	padding: 2em;
	color: ${({ theme }) => theme.colors.text[600]};
	font-size: 0.9em;
	background-color: ${({ theme }) => theme.colors.semantic.error};
`;

export default ErrorMessage;
