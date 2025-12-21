import { For } from "solid-js";

import { useAppDispatch, useAppSelector } from "#app-store/hooks/base";
import { setTheme } from "#app-store/ui/actions";
import { selectTheme } from "#app-store/ui/selectors";
import { THEMES } from "#app-store/ui/slice";
import { RadioInput } from "#components/radio-input";

import type { Theme } from "#app-store/ui/slice";
import type { JSX } from "solid-js";

export function ThemeSelect() {
	const selected = useAppSelector(selectTheme);
	const dispatch = useAppDispatch();

	const handleChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (
		event,
	) => {
		event.preventDefault();

		const { currentTarget } = event;

		if (isValidTheme(currentTarget.value)) {
			dispatch(setTheme(currentTarget.value));
		}
	};

	return (
		<fieldset class="flex items-center gap-2 text-sm">
			<legend class="sr-only">Theme select</legend>
			<For each={THEMES}>
				{(theme) => (
					<RadioInput
						label={theme.charAt(0).toUpperCase()}
						title={theme}
						name="theme-select"
						id={theme}
						value={theme}
						checked={selected() === theme}
						onChange={handleChange}
					/>
				)}
			</For>
		</fieldset>
	);
}

function isValidTheme(value: unknown): value is Theme {
	return typeof value === "string" && THEMES.includes(value);
}
