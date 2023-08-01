import type { ParentProps } from "solid-js";

export default function ErrorMessage(props: ParentProps) {
	return (
		<div class="w-full bg-semanticError p-4 text-sm text-text600">
			{props.children}
		</div>
	);
}
