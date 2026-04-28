import { tj } from "~/style";

export function LoopHandle(props: { align: Alignment }) {
	return (
		<div
			class={tj(
				"pointer-events-none relative block-full inline-full",
				props.align === "end" && "-translate-x-full",
			)}
		>
			<Tag align={props.align} verticalPosition="top" />
			<div
				class={tj(
					"absolute inset-bs-0 block-full inline-full",
					props.align === "start" &&
						"-inset-s-full border-e border-e-emphasis-600",
					props.align === "end" &&
						"-inset-e-full border-s border-s-emphasis-600",
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
				"pointer-events-auto absolute bg-emphasis-600 block-px inline-3/5",
				props.verticalPosition === "top" && "inset-bs-0",
				props.verticalPosition === "bottom" && "inset-be-0",
				props.align === "start" && "inset-s-0",
				props.align === "end" && "inset-e-0",
			)}
		/>
	);
}

type Alignment = "start" | "end";
