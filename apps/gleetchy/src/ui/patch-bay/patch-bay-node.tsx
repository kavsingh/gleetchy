import { createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";

import useConnection from "~/app-store/hooks/use-connection";

import type { AudioNodeMeta } from "~/types";

export default function PatchBayNode(props: {
	source: AudioNodeMeta;
	target: AudioNodeMeta;
}) {
	const { connection, isBlocked, toggleConnection } = useConnection(
		// eslint-disable-next-line solid/reactivity
		props.source,
		// eslint-disable-next-line solid/reactivity
		props.target,
	);
	const color = createMemo(() => connection()?.color);
	const title = createMemo(() => {
		return isBlocked()
			? "This will cause a circular connection, big feedback, ear bleeding, much sadness"
			: `From ${props.source.label} to ${props.target.label}`;
	});

	return (
		<button
			title={title()}
			onClick={toggleConnection}
			style={{ color: color() ?? "currentcolor" }}
			class={twMerge(
				"mx-auto mb-0 h-3 w-3 border p-0 transition-all",
				!color() && "border-text100",
				!color() && !isBlocked() && "hover:border-text400",
				isBlocked() && "rotate-45 scale-50 cursor-default bg-text100",
				!!color() && !isBlocked() && "border-current bg-current",
			)}
		/>
	);
}
