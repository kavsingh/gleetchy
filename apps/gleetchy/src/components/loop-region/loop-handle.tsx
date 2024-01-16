import { twMerge } from "tailwind-merge";

export default function LoopHandle(props: { align: Alignment }) {
	return (
		<div
			class={twMerge(
				"pointer-events-none relative size-full",
				props.align === "end" && "translate-x-[-100%]",
			)}
		>
			<Tag align={props.align} verticalPosition="top" />
			<div
				class={twMerge(
					"absolute top-0 size-full",
					props.align === "start" && "start-[-100%] border-r border-r-text600",
					props.align === "end" && "end-[-100%] border-l border-l-text600",
				)}
			/>
			<Tag align={props.align} verticalPosition="bottom" />
		</div>
	);
}

function Tag(props: { align: Alignment; verticalPosition?: "top" | "bottom" }) {
	return (
		<div
			class={twMerge(
				"pointer-events-auto absolute h-[1px] w-[60%] bg-text600",
				props.verticalPosition === "top" && "top-0",
				props.verticalPosition === "bottom" && "bottom-0",
				props.align === "start" && "start-0",
				props.align === "end" && "end-0",
			)}
		/>
	);
}

type Alignment = "start" | "end";
