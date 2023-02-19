import { memo } from "react";
import cx from "classnames";

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
			className={cx("border p-0 bs-3 is-3 mlb-0 mli-auto transition-all", {
				["border-text100"]: !color,
				["hover:border-text400"]: !color && !isBlocked,
				["cursor-default transform rotate-45 scale-50"]: isBlocked,
				["bg-text100"]: isBlocked,
				["bg-current"]: !!color && !isBlocked,
				["border-current"]: !!color && !isBlocked,
			})}
		/>
	);
});
