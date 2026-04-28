import { For } from "solid-js";

import { Button } from "./button";
import { TextInput } from "./text-input";

import type { ParentProps } from "solid-js";
import type { AudioNodeConnection } from "~/types";

export function TitleBar(props: Props) {
	return (
		<div class="mbe-2 text-xs">
			<div class="flex items-center justify-start">
				<div class="flex block-full">
					<For each={props.connections}>
						{(connection) => (
							<div
								class="me-1 shrink-0 grow-0 border-current bg-current block-3 inline-3"
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
				<Button onClick={() => void props.onRemoveClick()}>Remove</Button>
			</div>
		</div>
	);
}

type Props = ParentProps<{
	label: string;
	type: string;
	onRemoveClick: () => unknown;
	connections?: AudioNodeConnection[];
	onLabelChange?: ((label: string) => unknown) | undefined;
}>;
