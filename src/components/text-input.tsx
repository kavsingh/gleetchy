import { noop } from "lodash";
import { useCallback, memo, useRef } from "react";
import AutosizeInput from "react-input-autosize";

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
		<div>
			<AutosizeInput
				inputClassName="cursor-text border-none bg-transparent text-current transition-colors border-be border-be-transparent hover:text-text600 focus:text-text600 focus:border-be-current focus-visible:outline-none active:text-text600"
				style={{ font: "inherit" }}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				// TODO: investigate a fix
				// @ts-expect-error typing conflict AutoSize lib
				ref={inputRef}
			/>
		</div>
	);
});

type Props = {
	value: string | number;
	placeholder?: string;
	onChange?(value: string | number): unknown;
};
