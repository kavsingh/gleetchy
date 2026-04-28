import { splitProps } from "solid-js";

import { tj } from "~/style";

import type { ComponentProps, JSX } from "solid-js";

export function RadioInput(_props: Props) {
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
						"pointer-events-none z-0 border block-[0.8em] inline-[0.8em]",
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

interface Props extends Omit<
	ComponentProps<"input">,
	"type" | "hidden" | "class" | "classList"
> {
	label: JSX.Element;
}
