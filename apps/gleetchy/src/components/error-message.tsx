import type { ParentProps } from "solid-js";

export default function ErrorMessage(props: ParentProps) {
	return (
		<div class="w-full bg-semantic-error p-4 text-sm text-emphasis-600">
			{props.children}
		</div>
	);
}
