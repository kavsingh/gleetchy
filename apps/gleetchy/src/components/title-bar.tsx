import { For, type ParentProps } from "solid-js";

import Button from "./button";
import TextInput from "./text-input";

import type { AudioNodeConnection } from "~/types";

export default function TitleBar(props: Props) {
	return (
		<div class="mb-2 text-xs">
			<div class="flex items-center justify-start">
				<div class="flex h-full">
					<For each={props.connections}>
						{(connection) => (
							<div
								class="me-1 h-3 w-3 shrink-0 grow-0 border-current bg-current"
								style={{ color: connection.color }}
							/>
						)}
					</For>
				</div>
				<TextInput onChange={props.onLabelChange} value={props.label} />
			</div>
			<div class="flex items-center">
				<div class="me-1">{props.type} /</div>
				{props.children}
				<Button onClick={props.onRemoveClick}>Remove</Button>
			</div>
		</div>
	);
}

type Props = ParentProps<{
	label: string;
	type: string;
	connections?: AudioNodeConnection[];
	onLabelChange?: ((label: string) => unknown) | undefined;
	onRemoveClick?: (() => unknown) | undefined;
}>;
