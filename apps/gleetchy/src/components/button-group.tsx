import { Button } from "./button";

import type { ParentProps } from "solid-js";

export function ButtonGroup(props: ParentProps) {
	return (
		<div class="flex items-center justify-center px-0 py-3 inline-full min-block-20">
			{props.children}
		</div>
	);
}

export { Button };
