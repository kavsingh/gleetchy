import { For } from "solid-js";

import RadioInput from "#components/radio-input";
import { setTheme, ui, THEMES } from "#stores/ui";

import type { Theme } from "#stores/ui";
import type { JSX } from "solid-js";

export default function ThemeSelect() {
	const handleChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (
		event,
	) => {
		event.preventDefault();

		const { currentTarget } = event;

		if (isValidTheme(currentTarget.value)) setTheme(currentTarget.value);
	};

	return (
		<fieldset class="flex items-center gap-2 text-sm">
			<legend class="sr-only">Theme select</legend>
			<For each={THEMES}>
				{(option) => (
					<RadioInput
						label={option.charAt(0).toUpperCase()}
						title={option}
						name="theme-select"
						id={option}
						value={option}
						checked={ui.theme === option}
						onChange={handleChange}
					/>
				)}
			</For>
		</fieldset>
	);
}

function isValidTheme(value: unknown): value is Theme {
	return THEMES.includes(value as Theme);
}
