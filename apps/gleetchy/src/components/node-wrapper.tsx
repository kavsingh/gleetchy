import { twMerge } from "tailwind-merge";

import type { ParentProps } from "solid-js";

export default function NodeWrapper(props: ParentProps<{ isActive: boolean }>) {
	return (
		<div
			class={twMerge(
				"transition-opacity",
				props.isActive ? "opacity-100" : "opacity-40",
			)}
		>
			{props.children}
		</div>
	);
}
