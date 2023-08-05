import { Match, Switch, createMemo, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX, ParentProps } from "solid-js";

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
			<Switch fallback={props.children}>
				<Match when={isBraced()}>[ {props.children} ]</Match>
			</Switch>
		</button>
	);
}

type Props = ParentProps<
	Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "classList"> & {
		variant?: Variant;
	}
>;

export type Variant = "braced" | "text";
