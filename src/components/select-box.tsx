import { memo, useCallback } from "react";

import type { ChangeEventHandler } from "react";

export default memo(function SelectBox({ options, value, onChange }: Props) {
	const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(event) => {
			onChange?.(event.target.value);
		},
		[onChange],
	);

	return (
		<select
			value={value ?? options[0]?.value}
			onChange={handleChange}
			className="relative m-0 appearance-none border-0 bg-transparent p-0 font-sans text-sm leading-normal text-current underline transition-colors border-be-text600 focus:text-text600"
		>
			{options.map((option) => (
				<option className="" key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
});

type Props = {
	options: { value: string; label: string }[];
	value?: string;
	onChange?: (value: string) => unknown;
};
