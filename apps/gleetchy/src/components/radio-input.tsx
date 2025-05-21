import { splitProps } from "solid-js";

import { tj } from "#style";

import type { ComponentProps, JSX } from "solid-js";

export default function RadioInput(_props: Props) {
	const [props, inputProps] = splitProps(_props, ["ref", "label"]);

	return (
		<label
			title={inputProps.title ?? ""}
			for={inputProps.id ?? ""}
			class="flex cursor-pointer items-center gap-[0.3em]"
		>
			<div class="leading-none">{props.label}</div>
			<div class="relative">
				<div
					class={tj(
						"pointer-events-none z-0 size-[0.8em] border",
						inputProps.checked
							? "border-emphasis-400 bg-emphasis-400"
							: "border-emphasis-100",
					)}
				/>
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
	ComponentProps<"input">,
	"type" | "hidden" | "class" | "classList"
> & {
	label: JSX.Element;
};
