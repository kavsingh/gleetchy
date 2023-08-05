import Button from "./button";

import type { ParentProps } from "solid-js";

export default function ButtonGroup(props: ParentProps) {
	return (
		<div class="flex min-h-[5rem] w-full items-center justify-center px-0 py-3">
			{props.children}
		</div>
	);
}

export { Button };
