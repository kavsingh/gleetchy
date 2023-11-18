import { splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function RadioInput(_props: Props) {
	const [props, inputProps] = splitProps(_props, ["ref", "label"]);

	return (
		<label
			title={inputProps.title ?? ""}
			for={inputProps.id ?? ""}
			class="flex cursor-pointer items-center gap-[0.3em]"
		>
			<div class="leading-[1]">{props.label}</div>
			<div class="relative">
				<div
					class={twMerge(
						"pointer-events-none z-0 h-[0.8em] w-[0.8em] border border-text100",
						inputProps.checked && "border-text400 bg-text400",
					)}
				/>
				{/* @ts-expect-error exact optionals */}
				<input
					{...inputProps}
					ref={props.ref}
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
