import { splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js/jsx-runtime";

export default function RadioInput(props: Props) {
	const [local, inputProps] = splitProps(props, ["ref", "label"]);

	return (
		<label
			title={inputProps.title}
			for={inputProps.id}
			class="flex cursor-pointer items-center gap-[0.3em]"
		>
			<div class="leading-[1]">{local.label}</div>
			<div class="relative">
				<div
					class={twMerge(
						"pointer-events-none z-0 h-[0.8em] w-[0.8em] border border-text100",
						inputProps.checked && "border-text400 bg-text400",
					)}
				/>
				<input
					{...inputProps}
					ref={local.ref}
					type="radio"
					class="absolute inset-0 z-10 cursor-pointer opacity-0"
				/>
			</div>
		</label>
	);
}

type Props = Omit<
	JSX.InputHTMLAttributes<HTMLInputElement>,
	"class" | "type" | "hidden" | "classList"
> & {
	label: JSX.Element;
};