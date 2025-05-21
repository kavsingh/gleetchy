import { createMemo } from "solid-js";

import useConnection from "#app-store/hooks/use-connection";
import { tj } from "#style";

import type { AudioNodeMeta } from "#types";

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
			class={tj(
				"mx-auto mb-0 size-3 border p-0 transition-all",
				!color() && "border-emphasis-100",
				!color() && !isBlocked() && "hover:border-emphasis-400",
				isBlocked() && "scale-50 rotate-45 cursor-default bg-emphasis-100",
				!!color() && !isBlocked() && "border-current bg-current",
			)}
		/>
	);
}
