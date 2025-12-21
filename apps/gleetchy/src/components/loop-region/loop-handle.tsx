import { tj } from "#style";

export function LoopHandle(props: { align: Alignment }) {
	return (
		<div
			class={tj(
				"pointer-events-none relative size-full",
				props.align === "end" && "-translate-x-full",
			)}
		>
			<Tag align={props.align} verticalPosition="top" />
			<div
				class={tj(
					"absolute top-0 size-full",
					props.align === "start" &&
						"-start-full border-r border-r-emphasis-600",
					props.align === "end" && "-end-full border-l border-l-emphasis-600",
				)}
			/>
			<Tag align={props.align} verticalPosition="bottom" />
		</div>
	);
}

function Tag(props: { align: Alignment; verticalPosition?: "top" | "bottom" }) {
	return (
		<div
			class={tj(
				"pointer-events-auto absolute h-px w-3/5 bg-emphasis-600",
				props.verticalPosition === "top" && "top-0",
				props.verticalPosition === "bottom" && "bottom-0",
				props.align === "start" && "start-0",
				props.align === "end" && "end-0",
			)}
		/>
	);
}

type Alignment = "start" | "end";
