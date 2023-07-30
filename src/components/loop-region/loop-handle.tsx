import { memo } from "react";
import { twMerge } from "tailwind-merge";

export default memo(function LoopHandle({
	align = "start",
}: {
	align: Alignment;
}) {
	return (
		<div
			className={twMerge(
				"pointer-events-none relative h-full w-full",
				align === "end" && "translate-x-[-100%]",
			)}
		>
			<Tag align={align} verticalPosition="top" />
			<div
				className={twMerge(
					"absolute top-0 h-full w-full",
					align === "start" && "start-[-100%] border-r border-r-text600",
					align === "end" && "end-[-100%] border-l border-l-text600",
				)}
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
			className={twMerge(
				"pointer-events-auto absolute h-[1px] w-[60%] bg-text600",
				verticalPosition === "top" && "top-0",
				verticalPosition === "bottom" && "bottom-0",
				align === "start" && "start-0",
				align === "end" && "end-0",
			)}
		/>
	);
}

type Alignment = "start" | "end";
