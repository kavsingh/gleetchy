import { memo } from "react";
import { twMerge } from "tailwind-merge";

import useConnection from "~/app-store/hooks/use-connection";

import type { AudioNodeMeta } from "~/types";

export default memo(function PatchBayNode({
	source,
	target,
}: {
	source: AudioNodeMeta;
	target: AudioNodeMeta;
}) {
	const { connection, isBlocked, toggleConnection } = useConnection(
		source,
		target,
	);
	const color = connection?.color;
	const title = isBlocked
		? "This will cause a circular connection, big feedback, ear bleeding, much sadness"
		: `From ${source.label} to ${target.label}`;

	return (
		<button
			title={title}
			onClick={toggleConnection}
			style={{ color: color ?? "currentcolor" }}
			className={twMerge(
				"mx-auto mb-0 h-3 w-3 border p-0 transition-all",
				!color && "border-text100",
				!color && !isBlocked && "hover:border-text400",
				isBlocked && "rotate-45 scale-50 cursor-default bg-text100",
				!!color && !isBlocked && "border-current bg-current",
			)}
		/>
	);
});
