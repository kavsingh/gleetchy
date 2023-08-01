import { Match, Switch, createMemo, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX, ParentProps } from "solid-js";

export default function Button(props: Props) {
	const [local, buttonProps] = splitProps(props, [
		"class",
		"variant",
		"children",
	]);
	const isBraced = createMemo(() =>
		local.variant ? local.variant === "braced" : true,
	);

	return (
		<button
			{...buttonProps}
			class={twMerge(
				"block appearance-none transition-colors hover:text-text600 focus-visible:text-text600 active:text-text600 disabled:cursor-default disabled:text-text100",
				isBraced() && "text-xs",
				local.class,
			)}
		>
			<Switch fallback={local.children}>
				<Match when={isBraced()}>[ {local.children} ]</Match>
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
