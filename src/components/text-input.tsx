import { useCallback, memo, useRef } from "react";
import AutosizeInput from "react-input-autosize";
import styled from "@emotion/styled";
import { noop } from "lodash";

import { cancelReactEvent } from "~/lib/util";

import type {
	ChangeEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
} from "react";

export default memo(function TextInput({
	value,
	placeholder = "",
	onChange = noop,
}: Props) {
	const initialValueRef = useRef(value);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(
		(event) => {
			initialValueRef.current = event.currentTarget.value;
		},
		[],
	);

	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			cancelReactEvent(event);
			onChange(event.currentTarget.value);
		},
		[onChange],
	);

	const handleKeyDown = useCallback<KeyboardEventHandler>(
		(event) => {
			if (!["Enter", "Escape"].includes(event.key)) return;

			event.preventDefault();
			inputRef.current?.blur();

			if (event.key === "Escape") onChange(initialValueRef.current);
		},
		[onChange],
	);

	return (
		<Container>
			<AutosizeInput
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				// TODO: investigate a fix
				// @ts-expect-error typing conflict AutoSize lib
				ref={inputRef}
			/>
		</Container>
	);
});

type Props = {
	value: string | number;
	placeholder?: string;
	onChange?(value: string | number): unknown;
};

const Container = styled.div`
	input {
		border: none;
		border-block-end: 1px solid transparent;
		color: currentColor;
		font: inherit;
		background-color: transparent;
		cursor: initial;
		transition: color 0.2s ease-out, border-block-end-color 0.2s ease-out;

		&:hover,
		&:active,
		&:focus {
			color: ${({ theme }) => theme.colors.text[600]};
		}

		&:focus {
			border-bottom-color: currentColor;
		}

		&:focus-visible {
			outline: none;
		}
	}
`;
