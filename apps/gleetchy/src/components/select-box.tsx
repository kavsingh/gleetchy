import { For } from "solid-js";

import type { JSX } from "solid-js";

export function SelectBox(props: Props) {
	const handleChange: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = (
		event,
	) => {
		props.onChange?.(event.target.value);
	};

	return (
		<select
			value={props.value ?? props.options[0]?.value ?? ""}
			onChange={handleChange}
			class="relative m-0 appearance-none border-0 border-b-emphasis-600 bg-transparent p-0 font-sans text-sm text-current underline transition-colors focus:text-emphasis-600"
		>
			<For each={props.options}>
				{(option) => <option value={option.value}>{option.label}</option>}
			</For>
		</select>
	);
}

interface Props {
	options: { value: string; label: string }[];
	value?: string;
	onChange?: (value: string) => unknown;
}
