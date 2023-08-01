import type { JSX } from "solid-js/jsx-runtime";

export default function TextInput(props: Props) {
	let inputRef: HTMLInputElement | undefined;
	// eslint-disable-next-line solid/reactivity
	let initialValue = props.value;

	const handleFocus: JSX.FocusEventHandlerUnion<
		HTMLInputElement,
		FocusEvent
	> = (event) => {
		initialValue = event.currentTarget.value;
	};

	const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		event,
	) => {
		event.preventDefault();
		props.onChange?.(event.currentTarget.value);
	};

	const handleKeyDown: JSX.EventHandlerUnion<
		HTMLInputElement,
		KeyboardEvent
	> = (event) => {
		if (!["Enter", "Escape"].includes(event.key)) return;

		event.preventDefault();
		inputRef?.blur();

		if (props.onChange && event.key === "Escape") props.onChange(initialValue);
	};

	return (
		<input
			type="text"
			class="cursor-text border-b border-none border-b-transparent bg-transparent text-current transition-colors hover:text-text600 focus:border-b-current focus:text-text600 focus-visible:outline-none active:text-text600"
			ref={inputRef}
			value={props.value}
			placeholder={props.placeholder}
			onChange={handleChange}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
		/>
	);
}

type Props = {
	value: string;
	placeholder?: string | undefined;
	onChange?: ((value: string) => unknown) | undefined;
};
