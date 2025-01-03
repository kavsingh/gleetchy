import { Show, createMemo, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

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
			class={twMerge(
				"block appearance-none transition-colors hover:text-text600 focus-visible:text-text600 active:text-text600 disabled:cursor-default disabled:text-text100",
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

type Props = Omit<ComponentProps<"button">, "classList"> & {
	variant?: Variant;
};

export type Variant = "braced" | "text";
