import { twMerge } from "tailwind-merge";

import type { PropsWithChildren } from "react";

export default function NodeWrapper({
	isActive,
	children,
}: PropsWithChildren<{ isActive: boolean }>) {
	return (
		<div
			className={twMerge(
				"opacity-40 transition-opacity",
				isActive && "opacity-100",
			)}
		>
			{children}
		</div>
	);
}
