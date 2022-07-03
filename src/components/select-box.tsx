import styled from "@emotion/styled";
import { useCallback } from "react";

import type { FC, ChangeEventHandler } from "react";

const SelectBox: FC<{
	options: { value: string; label: string }[];
	value?: string;
	onChange?: (value: string) => unknown;
}> = ({ options, value, onChange }) => {
	const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(event) => {
			onChange?.(event.target.value);
		},
		[onChange],
	);

	return (
		<Container value={value ?? options[0]?.value} onChange={handleChange}>
			{options.map((option) => (
				<Option key={option.value} value={option.value}>
					{option.label}
				</Option>
			))}
		</Container>
	);
};

export default SelectBox;

const Container = styled.select`
	appearance: none;
	line-height: normal;
	position: relative;
	border: none;
	background-color: transparent;
	color: currentcolor;
	font-family: ${({ theme }) => theme.fonts.body};
	font-size: 0.8em;
	border-block-end: 1px solid transparent;
	transition: border-color 0.2s ease-out;
	padding: 0;
	margin: 0;

	&:focus {
		color: 1px solid ${({ theme }) => theme.colors.text[600]};
		border-block-end-color: ${({ theme }) => theme.colors.text[600]};
	}
`;

const Option = styled.option`
	appearance: none;
	line-height: normal;
	position: relative;
	font-family: ${({ theme }) => theme.fonts.body};
	font-size: 0.8em;
	border: none;
	background-color: transparent;
	color: currentcolor;
	padding: 0;
	margin: 0;
`;
