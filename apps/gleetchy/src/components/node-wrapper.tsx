import { tj } from "#style";

import type { ParentProps } from "solid-js";

export function NodeWrapper(props: ParentProps<{ isActive: boolean }>) {
	return (
		<div
			class={tj(
				"transition-opacity",
				props.isActive ? "opacity-100" : "opacity-40",
			)}
		>
			{props.children}
		</div>
	);
}
