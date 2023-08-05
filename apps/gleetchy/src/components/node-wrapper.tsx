import { twMerge } from "tailwind-merge";

import type { ParentProps } from "solid-js";

export default function NodeWrapper(props: ParentProps<{ isActive: boolean }>) {
	return (
		<div
			class={twMerge(
				"opacity-40 transition-opacity",
				props.isActive && "opacity-100",
			)}
		>
			{props.children}
		</div>
	);
}
