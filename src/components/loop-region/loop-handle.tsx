import { memo } from "react";
import cx from "classnames";

export default memo(function LoopHandle({
	align = "left",
}: {
	align: Alignment;
}) {
	return (
		<div
			className={cx("relative w-full h-full pointer-events-none", {
				["transform translate-x-[-100%]"]: align === "right",
			})}
		>
			<Tag align={align} verticalPosition="top" />
			<div
				className={cx("absolute top-0 w-full h-full", {
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
			className={cx("absolute w-[60%] h-[1px] pointer-events-auto bg-text600", {
				["top-0"]: verticalPosition === "top",
				["right-0"]: align === "right",
				["bottom-0"]: verticalPosition === "bottom",
				["left-0"]: align === "left",
			})}
		/>
	);
}

type Alignment = "left" | "right";
