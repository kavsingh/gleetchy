import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "~/app-store/hooks/base";
import { setTheme } from "~/app-store/ui/actions";
import { selectTheme } from "~/app-store/ui/selectors";
import { THEMES } from "~/app-store/ui/slice";
import RadioInput from "~/components/radio-input";

import type { ChangeEventHandler } from "react";
import type { Theme } from "~/app-store/ui/slice";

export default function ThemeSelect() {
	const selected = useAppSelector(selectTheme);
	const dispatch = useAppDispatch();

	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			event.preventDefault();

			const { target } = event;

			if (target instanceof HTMLInputElement && isValidTheme(target.value)) {
				dispatch(setTheme(target.value));
			}
		},
		[dispatch],
	);

	return (
		<fieldset className="flex items-center gap-2 text-sm">
			<legend className="sr-only">Theme select</legend>
			{THEMES.map((theme) => (
				<RadioInput
					key={theme}
					label={theme.charAt(0).toUpperCase()}
					title={theme}
					name="theme-select"
					id={theme}
					value={theme}
					checked={selected === theme}
					onChange={handleChange}
				/>
			))}
		</fieldset>
	);
}

function isValidTheme(value: unknown): value is Theme {
	return THEMES.includes(value as Theme);
}