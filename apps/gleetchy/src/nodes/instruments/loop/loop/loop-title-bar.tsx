import { Show } from "solid-js";

import Button from "#components/button";
import TitleBar from "#components/title-bar";

import type { LoopUIProps } from "./types";

export default function LoopTitleBar(props: Props) {
	return (
		<TitleBar
			type="Loop"
			label={props.label}
			onLabelChange={props.onLabelChange}
			onRemoveClick={props.remove}
			connections={props.connections}
		>
			<div class="flex gap-1">
				<Show when={props.fileName}>
					{(fileName) => <span>{fileName()} - </span>}
				</Show>
				<Show when={props.audioBuffer?.duration}>
					{(duration) => <span>{duration().toFixed(2)}s</span>}
				</Show>
				<Show when={props.fileName}>
					<span>/</span>
				</Show>
				<Button onClick={props.selectAudioFile}>
					<Show when={!!props.audioBuffer} fallback="Load">
						Replace
					</Show>{" "}
					audio file
				</Button>
				<Show when={props.audioBuffer}>
					<Button onClick={props.duplicate}>Clone</Button>
				</Show>
			</div>
		</TitleBar>
	);
}

interface Props extends Pick<
	LoopUIProps,
	| "fileName"
	| "audioBuffer"
	| "label"
	| "onLabelChange"
	| "duplicate"
	| "remove"
	| "connections"
> {
	selectAudioFile: () => unknown;
}
