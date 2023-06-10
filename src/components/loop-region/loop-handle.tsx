import { memo } from "react";

import { tcx } from "~/lib/css";

export default memo(function LoopHandle({
	align = "left",
}: {
	align: Alignment;
}) {
	return (
		<div
			className={tcx("pointer-events-none relative h-full w-full", {
				["translate-x-[-100%]"]: align === "right",
			})}
		>
			<Tag align={align} verticalPosition="top" />
			<div
				className={tcx("absolute top-0 h-full w-full", {
					["right-[-100%]"]: align === "right",
					["border-l border-l-text600"]: align === "right",
					["left-[-100%]"]: align === "left",
					["border-r border-r-text600"]: align === "left",
				})}
			/>
			<Tag align={align} verticalPosition="bottom" />
		</div>
	);
});

function Tag({
	align,
	verticalPosition,
}: {
	align: Alignment;
	verticalPosition?: "top" | "bottom";
}) {
	return (
		<div
			className={tcx(
				"pointer-events-auto absolute h-[1px] w-[60%] bg-text600",
				{
					["top-0"]: verticalPosition === "top",
					["right-0"]: align === "right",
					["bottom-0"]: verticalPosition === "bottom",
					["left-0"]: align === "left",
				},
			)}
		/>
	);
}

type Alignment = "left" | "right";
