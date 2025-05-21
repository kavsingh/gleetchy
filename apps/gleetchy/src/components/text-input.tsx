import { createEffect, createSignal } from "solid-js";

import type { JSX } from "solid-js";

export default function TextInput(props: Props) {
	// eslint-disable-next-line solid/reactivity
	let initialValue = props.value;
	let inputRef: HTMLInputElement | undefined;
	const [value, setValue] = createSignal(initialValue);

	const handleFocus: JSX.FocusEventHandlerUnion<
		HTMLInputElement,
		FocusEvent
	> = () => {
		initialValue = value();
	};

	const handleInput: JSX.InputEventHandlerUnion<
		HTMLInputElement,
		InputEvent
	> = (event) => {
		event.preventDefault();
		setValue(event.currentTarget.value);
	};

	const handleKeyDown: JSX.EventHandlerUnion<
		HTMLInputElement,
		KeyboardEvent
	> = (event) => {
		if (!["Enter", "Escape"].includes(event.key)) return;

		event.preventDefault();
		inputRef?.blur();

		if (event.key === "Escape") setValue(initialValue);
	};

	createEffect(() => {
		props.onChange?.(value());
	});

	return (
		<div class="relative inline-block border-b border-b-transparent focus-within:border-b-current">
			<input
				type="text"
				class="absolute inset-0 z-10 cursor-text bg-transparent text-current transition-colors hover:text-emphasis-600 focus:text-emphasis-600 focus-visible:outline-none active:text-emphasis-600"
				ref={(el) => (inputRef = el)}
				value={props.value}
				placeholder={props.placeholder ?? ""}
				onInput={handleInput}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
			/>
			<span class="pointer-events-none z-0 block h-5 min-w-[1ch] opacity-0">
				{value()}
			</span>
		</div>
	);
}

type Props = {
	value: string;
	placeholder?: string | undefined;
	onChange?: ((value: string) => unknown) | undefined;
};
