import { tcx } from "~/lib/css";

import type { PropsWithChildren } from "react";

export default function NodeWrapper({
	isActive,
	children,
}: PropsWithChildren<{ isActive: boolean }>) {
	return (
		<div
			className={tcx("opacity-40 transition-opacity", {
				["opacity-100"]: isActive,
			})}
		>
			{children}
		</div>
	);
}
