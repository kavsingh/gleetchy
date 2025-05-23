import { Show, createMemo, splitProps } from "solid-js";

import { tm } from "#style";

import type { ComponentProps } from "solid-js";

export default function Button(_props: Props) {
	const [props, buttonProps] = splitProps(_props, [
		"class",
		"variant",
		"children",
	]);
	const isBraced = createMemo(() =>
		props.variant ? props.variant === "braced" : true,
	);

	return (
		<button
			{...buttonProps}
			class={tm(
				"block appearance-none transition-colors hover:text-emphasis-600 focus-visible:text-emphasis-600 active:text-emphasis-600 disabled:cursor-default disabled:text-emphasis-100",
				isBraced() && "text-xs",
				props.class,
			)}
		>
			<Show when={isBraced()} fallback={props.children}>
				[ {props.children} ]
			</Show>
		</button>
	);
}

interface Props extends Omit<ComponentProps<"button">, "classList"> {
	variant?: Variant;
}

export type Variant = "braced" | "text";
