import type { ParentProps } from "solid-js";

export function ErrorMessage(props: ParentProps) {
	return (
		<div class="bg-semantic-error p-4 text-sm text-emphasis-600 inline-full">
			{props.children}
		</div>
	);
}
